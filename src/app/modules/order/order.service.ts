import { StatusCodes } from "http-status-codes";
import { startSession, Types } from "mongoose";
import { AppError } from "../../errorHelpers/AppError";
import { logActivity } from "../../utils/activitiLogger";
import { QueryBuilder } from "../../utils/queryBuilder";
import { ActionCategory } from "../activitiTracking/activitiTracking.interface";
import { IProduct, ProductStatus } from "../products/product.interface";
import { Product } from "../products/product.model";
import { IOrder, IOrderFillter, OrderStatus } from "./order.interface";
import { Order } from "./order.model";
import { isValidStatusTransition } from "./order.statusValidation";
import { calculatePriority } from "../../utils/calculateRestockPriority";
import { RestockQueue } from "../restock/restock.model";

export const orderServices = {
  createOrder: async (payload: IOrder, userId: string, userName: string) => {
    const session = await startSession();

    try {
      //  start the mongoose transaction
      session.startTransaction();

      let totalOrderPrice = 0;
      const lowStockProducts: IProduct[] = [];
      const selectedProductsIds = new Set<string>();

      // 1. Loop through each item in the order to validate product availability and stock
      for (const item of payload.items) {
        const productId = item.product.toString();

        // 2. Checking for duplicate products in the order
        if (selectedProductsIds.has(productId)) {
          const duplicateProduct = await Product.findById(productId);

          throw new AppError(
            StatusCodes.CONFLICT,
            `"${duplicateProduct?.name}" is already added to the order`,
          );
        }

        selectedProductsIds.add(productId);

        const product = await Product.findById(productId).session(session);

        // 3. Checking the product existence
        if (!product || product.status === ProductStatus.OUT_OF_STOCK) {
          throw new Error(
            `"${product?.name || "Product"}" is currently unavailable.`,
          );
        }

        // 4. Checking the product stock is sufficient for the order quantity
        if (product.stock < item.quantity) {
          throw new Error(
            `Only ${product.stock} items available in stock for "${product.name}".`,
          );
        }

        // 5. Deduct the ordered quantity from the product stock and update the product status if necessary
        product.stock -= item.quantity;
        if (product.stock === 0) {
          product.status = ProductStatus.OUT_OF_STOCK;
        }
        await product.save({ session });

        // 6. Check if the product stock is below the minimum threshold and add it to the low stock products list
        if (product.stock <= product.minThreshold) {
          lowStockProducts.push(product);
        }

        // 7. Calculate the total price for the order
        totalOrderPrice += product.price * item.quantity;
      }

      payload.totalPrice = totalOrderPrice;

      payload.orderHistory = [
        {
          status: payload.status,
          changedAt: new Date(),
          changedBy: new Types.ObjectId(userId),
          note: "Order created",
        },
      ];

      const [newOrder] = await Order.create([payload], { session });

      await logActivity(
        {
          category: ActionCategory.ORDER,
          message: `Order #${newOrder.orderId} created by ${userName}`,
          performedBy: userName,
          metadata: {
            orderId: newOrder._id,
          },
        },
        session,
      );

      if (lowStockProducts.length > 0) {
        const bulkOps = lowStockProducts.map((product) => {
          const priority = calculatePriority(
            product.stock,
            product.minThreshold,
          );

          return {
            updateOne: {
              filter: { product: product._id },
              update: {
                $set: {
                  product: product._id,
                  currentStock: product.stock,
                  threshold: product.minThreshold,
                  priority,
                  isResolved: false,
                },
              },
              upsert: true,
            },
          };
        });

        await RestockQueue.bulkWrite(bulkOps);

        for (const product of lowStockProducts) {
          await logActivity(
            {
              message: `Product ${product.name} added in Restock Queue`,
              category: ActionCategory.STOCK,
              performedBy: userId,
              metadata: {
                productId: new Types.ObjectId(product._id),
                newValue: `Stock is ${product.stock}`,
                previousValue: `Threshold is ${product.minThreshold}`,
              },
            },
            session,
          );
        }
      }

      await session.commitTransaction();
      return newOrder;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  },

  getAllOrders: async (query: Record<string, string>) => {
    const { date, ...restQuery } = query;

    const initialQuery = Order.find();
    const filter: IOrderFillter = {};

    if (date) {
      const start = new Date(date);
      const end = new Date(date);

      end.setHours(23, 59, 59, 999);

      filter.createdAt = { $gte: start, $lte: end };
    }

    const queryBuilder = new QueryBuilder(initialQuery.find(filter), restQuery);

    const events = queryBuilder
      .search(["name"])
      .filter()
      .sort()
      .fields()
      .paginate()
      .populate("items.product", "name price");

    const [data, meta] = await Promise.all([
      events.build(),
      queryBuilder.getMeta(),
    ]);

    return { data, meta };
  },

  getOrderDetails: async (orderId: string) => {
    const orderDetails = await Order.findById(orderId).populate(
      "items.product",
      "name price",
    );

    if (!orderDetails) {
      throw new AppError(StatusCodes.NOT_FOUND, "This order does not exist");
    }

    return orderDetails;
  },

  updateOrderStatus: async (
    orderId: string,
    newStatus: OrderStatus,
    userName: string,
  ) => {
    const session = await startSession();
    session.startTransaction();

    try {
      const isOrderExist = await Order.findById(orderId).session(session);

      if (!isOrderExist) {
        throw new AppError(StatusCodes.NOT_FOUND, "This order does not exist");
      }

      const isValidTransitionsStatus = isValidStatusTransition(
        isOrderExist.status,
        newStatus,
      );

      if (!isValidTransitionsStatus) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `Invalid status transition from "${isOrderExist.status}" to "${newStatus}"`,
        );
      }

      const previousStatus = isOrderExist.status;

      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: newStatus },
        { new: true, runValidators: true, session },
      );

      if (!updatedOrder) {
        throw new AppError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Failed to update status",
        );
      }

      await logActivity(
        {
          category: ActionCategory.ORDER,
          message: `Order #${updatedOrder.orderId} status changed from ${previousStatus} to ${newStatus}`,
          performedBy: userName,
          metadata: {
            orderId: updatedOrder._id,
            previousValue: previousStatus as string,
            newValue: newStatus as string,
          },
        },
        session,
      );

      await session.commitTransaction();
      return updatedOrder;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  },

  deleteOrder: async (orderId: string, userName: string) => {
    const session = await startSession();
    session.startTransaction();

    try {
      const isOrderExist = await Order.findById(orderId).session(session);

      if (!isOrderExist) {
        throw new AppError(StatusCodes.NOT_FOUND, "This order does not exist");
      }

      if (isOrderExist.isDeleted) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Order is already deleted");
      }

      const deletedOrder = await Order.findByIdAndUpdate(
        orderId,
        { isDeleted: true },
        { new: true, session },
      );

      if (!deletedOrder) {
        throw new AppError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Failed to delete order",
        );
      }

      await logActivity(
        {
          category: ActionCategory.ORDER,
          message: `Order #${deletedOrder.orderId} was deleted by ${userName}`,
          performedBy: userName,
          metadata: {
            orderId: deletedOrder._id,
          },
        },
        session,
      );

      await session.commitTransaction();

      return deletedOrder;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  },
};
