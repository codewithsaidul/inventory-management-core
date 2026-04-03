import { StatusCodes } from "http-status-codes";
import { startSession, Types } from "mongoose";
import { AppError } from "../../errorHelpers/AppError";
import { logActivity } from "../../utils/activitiLogger";
import { slugifyUnique } from "../../utils/generateSlug";
import { QueryBuilder } from "../../utils/queryBuilder";
import { ActionCategory } from "../activitiTracking/activitiTracking.interface";
import { Category } from "../categories/categories.model";
import { productSearchableField } from "./product.constant";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";

export const productServices = {
  createProduct: async (payload: IProduct, userName: string) => {
    const session = await startSession();
    session.startTransaction();

    try {
      const productName = payload.name.trim().toLowerCase();
      const isProductExist = await Product.findOne({
        name: productName,
      }).session(session);

      if (isProductExist) {
        throw new AppError(
          StatusCodes.CONFLICT,
          "This product already exists! Try another one",
        );
      }

      const uniqueSlug = await slugifyUnique(
        [payload.name as string],
        Product,
        50,
      );

      const productData = {
        ...payload,
        slug: uniqueSlug,
      };

      const [product] = await Product.create([productData], { session });

      if (!product) {
        throw new AppError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Failed to create product",
        );
      }

      await logActivity(
        {
          category: ActionCategory.PRODUCT,
          message: `Product "${product.name}" was added to the inventory by ${userName}`,
          performedBy: userName,
          metadata: {
            productId: new Types.ObjectId(product._id),
            newValue: product.stock.toString(),
          },
        },
        session,
      );

      // Update category availableProducts
      if (product.stock > 0) {
        await Category.findByIdAndUpdate(
          product.category,
          { $inc: { availableProducts: 1 } },
          { session },
        );
      }

      await session.commitTransaction();

      return product;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  },

  getAllProducts: async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Product.find({ isDeleted: false }), query);

    const events = queryBuilder
      .search(productSearchableField)
      .filter()
      .sort()
      .fields()
      .paginate()
      .populate("category", "name");

    const [data, meta] = await Promise.all([
      events.build(),
      queryBuilder.getMeta(),
    ]);

    return { data, meta };
  },

  getProductDetails: async (slug: string) => {
    const product = await Product.findOne({ slug }).populate(
      "category",
      "name",
    );

    if (!product) {
      throw new AppError(StatusCodes.NOT_FOUND, "Product not found!");
    }

    return product;
  },

  updateProduct: async (
    productId: string,
    payload: Partial<IProduct>,
    userName: string,
  ) => {
    const session = await startSession();
    session.startTransaction();

    try {
      const product = await Product.findById(productId).session(session);
      if (!product) {
        throw new AppError(StatusCodes.NOT_FOUND, "Product not found!");
      }

      if (payload.name && payload.name !== product.name) {
        const uniqueSlug = await slugifyUnique(
          [payload.name as string],
          Product,
          50,
        );
        payload.slug = uniqueSlug;
      }

      const oldStock = product.stock;

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        payload,
        {
          runValidators: true,
          new: true,
          session,
        },
      );

      await logActivity(
        {
          category: ActionCategory.PRODUCT,
          message: `Product "${updatedProduct?.name}" was updated by ${userName}`,
          performedBy: userName,
          metadata: {
            productId: new Types.ObjectId(updatedProduct?._id),
            previousValue: oldStock.toString(),
            newValue: updatedProduct?.stock.toString(),
          },
        },
        session,
      );

      // Update category availableProducts
      const newStock = updatedProduct?.stock || 0;
      if ((oldStock <= 0 && newStock > 0) || (oldStock > 0 && newStock <= 0)) {
        const incValue = oldStock <= 0 && newStock > 0 ? 1 : -1;
        await Category.findByIdAndUpdate(
          product.category,
          { $inc: { availableProducts: incValue } },
          { session },
        );
      }

      // Handle category change
      if (
        updatedProduct &&
        product.category.toString() !== updatedProduct.category.toString()
      ) {
        // Decrement old category if old stock > 0
        if (oldStock > 0) {
          await Category.findByIdAndUpdate(
            product.category,
            { $inc: { availableProducts: -1 } },
            { session },
          );
        }
        // Increment new category if new stock > 0
        if (newStock > 0) {
          await Category.findByIdAndUpdate(
            updatedProduct.category,
            { $inc: { availableProducts: 1 } },
            { session },
          );
        }
      }

      await session.commitTransaction();
      return updatedProduct;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  },

  deleteProduct: async (productId: string, userName: string) => {
    const session = await startSession();
    session.startTransaction();

    try {
      const product = await Product.findById(productId).session(session);
      if (!product) {
        throw new AppError(StatusCodes.NOT_FOUND, "Product not found!");
      }

      if (product.isDeleted) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          "Product is already deleted!",
        );
      }

      const deletedProduct = await Product.findByIdAndUpdate(
        productId,
        { isDeleted: true },
        { new: true, session },
      );

      await logActivity(
        {
          category: ActionCategory.PRODUCT,
          message: `Product "${product.name}" was marked as deleted by ${userName}`,
          performedBy: userName,
          metadata: {
            productId: new Types.ObjectId(product._id),
          },
        },
        session,
      );

      // Update category availableProducts
      if (product.isDeleted) {
        await Category.findByIdAndUpdate(
          product.category,
          { $inc: { availableProducts: -1 } },
          { session },
        );
      }

      await session.commitTransaction();
      return deletedProduct;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  },
};
