import { Types } from "mongoose";
import { QueryBuilder } from "../../utils/queryBuilder";
import { restockSearchableField } from "./restock.constant";
import { RestockQueue } from "./restock.model";
import { logActivity } from "../../utils/activitiLogger";
import { ActionCategory } from "../activitiTracking/activitiTracking.interface";
import { Product } from "../products/product.model";
import { ProductStatus } from "../products/product.interface";

export const restockServices = {
  getAllRestockQueues: async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(RestockQueue.find(), query);

    const events = queryBuilder
      .search(restockSearchableField)
      .filter()
      .sort()
      .fields()
      .paginate()
      .populate("product", "name")
      .populate("resolvedBy", "name email");

    const [data, meta] = await Promise.all([
      events.build(),
      queryBuilder.getMeta(),
    ]);

    return { data, meta };
  },

  restockItem: async (
    id: string,
    payload: { addedStock: number },
    userId: string,
  ) => {
    const session = await RestockQueue.startSession();

    try {
      session.startTransaction();

      const restock = await RestockQueue.findById(id).session(session);

      if (!restock) {
        throw new Error("Restock item not found");
      }

      if (restock.isResolved) {
        throw new Error("Already restocked");
      }

      const product = await Product.findById(restock.product).session(session);

      if (!product) {
        throw new Error("Product not found");
      }

      if (payload.addedStock <= 0) {
        throw new Error("Invalid stock amount");
      }

      product.stock += payload.addedStock;
      product.status =
        product.stock > 0 ? ProductStatus.ACTIVE : ProductStatus.OUT_OF_STOCK;
      await product.save({ session });

      restock.isResolved = true;
      restock.resolvedBy = new Types.ObjectId(userId);
      restock.resolvedAt = new Date();

      await restock.save({ session });

      await logActivity(
        {
          message: `Product ${product.name} restocked by ${payload.addedStock}`,
          category: ActionCategory.STOCK,
          performedBy: userId,
          metadata: {
            productId: new Types.ObjectId(product._id),
            newValue: `Stock increased by ${payload.addedStock}`,
            previousValue: `Stock was ${product.stock - payload.addedStock}`,
          },
        },

        session,
      );

      await session.commitTransaction();
      session.endSession();

      return restock;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  },
};
