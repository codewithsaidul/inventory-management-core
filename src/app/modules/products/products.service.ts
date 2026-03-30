import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/queryBuilder";
import { productSearchableField } from "./product.constant";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import { slugifyUnique } from "../../utils/generateSlug";

export const productServices = {
  createProduct: async (payload: IProduct) => {
    const uniqueSlug = await slugifyUnique(
      [payload.name as string],
      Product,
      50,
    );

    const productData = {
      ...payload,
      slug: uniqueSlug,
    };

    const product = await Product.create(productData);
    return product;
  },

  getAllProducts: async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Product.find(), query);

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

  updateProduct: async (productId: string, payload: Partial<IProduct>) => {
    const product = await Product.findById(productId);

    if (!product) {
      throw new AppError(StatusCodes.NOT_FOUND, "Product not found!");
    }

    if (payload.name) {
      const uniqueSlug = await slugifyUnique(
        [payload.name as string],
        Product,
        50,
      );

      payload.slug = uniqueSlug;
    }

    const updateProduct = await Product.findByIdAndUpdate(productId, payload, {
      runValidators: true,
      new: true,
    });

    return updateProduct;
  },

  deleteProduct: async (productId: string) => {
    const product = await Product.findById(productId);

    if (!product) {
      throw new AppError(StatusCodes.NOT_FOUND, "Product not found!");
    }

    const deleteProduct = await Product.findByIdAndDelete(productId);

    return deleteProduct;
  },
};
