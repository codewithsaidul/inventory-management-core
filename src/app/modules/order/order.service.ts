import { startSession } from "mongoose";
import { IOrder } from "./order.interface";
import { Product } from "../products/product.model";
import { AppError } from "../../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { ProductStatus } from "../products/product.interface";
import { Order } from "./order.model";

export const orderServices = {
  createOrder: async (payload: IOrder) => {
    const session = await startSession();

    try {
      //  start the mongoose transaction
      session.startTransaction();

      let totalOrderPrice = 0;
      const lowStockProducts: string[] = [];
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
        if (!product || product.status === "Out of Stock") {
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
          lowStockProducts.push(product.name);
        }

        // 7. Calculate the total price for the order
        totalOrderPrice += product.price * item.quantity;
      }

      payload.totalPrice = totalOrderPrice;

      const result = await Order.create([payload], { session });

      if (lowStockProducts.length > 0) {
        console.log("🚀 ~ lowStockProducts:", lowStockProducts);
      }

      await session.commitTransaction();
      return result[0];
    } catch {
      await session.abortTransaction();
      throw Error;
    } finally {
      session.endSession();
    }
  },
};
