import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errorHelpers/AppError";
import { ICategory } from "./categories.interface";
import { Category } from "./categories.model";
import { slugifyUnique } from "../../utils/generateSlug";

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
};
