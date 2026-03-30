import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errorHelpers/AppError";
import { ICategory } from "./categories.interface";
import { Category } from "./categories.model";
import { slugifyUnique } from "../../utils/generateSlug";
import { QueryBuilder } from "../../utils/queryBuilder";

export const categoryServices = {
  createCategory: async (payload: ICategory) => {
    const isExist = await Category.findOne({ name: payload.name });

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
      .search(["name"])
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
        throw new AppError(StatusCodes.NOT_FOUND, "Category Not Found!!")
    }

    return category
  }
};
