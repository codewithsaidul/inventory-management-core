import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errorHelpers/AppError";
import { ICategory } from "./categories.interface";
import { Category } from "./categories.model";
import { slugifyUnique } from "../../utils/generateSlug";
import { QueryBuilder } from "../../utils/queryBuilder";
import { categorySearchableField } from "./categories.constant";

export const categoryServices = {
  createCategory: async (payload: ICategory) => {
    const categoryName = payload.name.trim().toLowerCase();
    const isExist = await Category.findOne({ name: categoryName });

    if (isExist) {
      throw new AppError(
        StatusCodes.CONFLICT,
        "This Category already exist! Try Different One",
      );
    }

    const uniqueSlug = await slugifyUnique(
      [payload.name as string],
      Category,
      50,
    );

    const categoryData = {
      ...payload,
      slug: uniqueSlug,
    };

    const category = await Category.create(categoryData);

    return category;
  },

  getAllCategory: async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Category.find(), query);

    const events = queryBuilder
      .search(categorySearchableField)
      .filter()
      .sort()
      .fields()
      .paginate();

    const [data, meta] = await Promise.all([
      events.build(),
      queryBuilder.getMeta(),
    ]);

    return { data, meta };
  },

  getSingleCategory: async (slug: string) => {
    const category = await Category.findOne({ slug });

    if (!category) {
      throw new AppError(StatusCodes.NOT_FOUND, "Category Not Found!!");
    }

    return category;
  },

  updateCategory: async (categoryId: string, payload: Partial<ICategory>) => {
    const isExist = await Category.findById(categoryId);

    if (!isExist) {
      throw new AppError(StatusCodes.NOT_FOUND, "Category Not Found!!");
    }

    if (payload.name) {
      const uniqueSlug = await slugifyUnique(
        [payload.name as string],
        Category,
        50,
      );

      payload.slug = uniqueSlug;
    }

    const updateCategory = await Category.findByIdAndUpdate(
      categoryId,
      payload,
      { new: true, runValidators: true },
    );

    return updateCategory;
  },

  deleteCategory: async (categoryId: string) => {
    const isExist = await Category.findById(categoryId);

    if (!isExist) {
      throw new AppError(StatusCodes.NOT_FOUND, "Category Not Found!!");
    }

    const deleteCategory = await Category.findByIdAndUpdate(
      categoryId,
      {
        isDeleted: true,
      },
      { new: true },
    );

    return deleteCategory;
  },
};
