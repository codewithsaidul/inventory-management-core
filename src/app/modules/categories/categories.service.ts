import { StatusCodes } from "http-status-codes";
import { startSession } from "mongoose";
import { AppError } from "../../errorHelpers/AppError";
import { logActivity } from "../../utils/activitiLogger";
import { slugifyUnique } from "../../utils/generateSlug";
import { QueryBuilder } from "../../utils/queryBuilder";
import { ActionCategory } from "../activitiTracking/activitiTracking.interface";
import { categorySearchableField } from "./categories.constant";
import { ICategory } from "./categories.interface";
import { Category } from "./categories.model";

export const categoryServices = {
  createCategory: async (payload: ICategory, userName: string) => {
    const session = await startSession();
    session.startTransaction();

    try {
      const categoryName = payload.name.trim().toLowerCase();
      const isExist = await Category.findOne({ name: categoryName }).session(
        session,
      );

      if (isExist) {
        throw new AppError(
          StatusCodes.CONFLICT,
          "This Category already exists! Try a different one",
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

      const [category] = await Category.create([categoryData], { session });

      if (!category) {
        throw new AppError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Failed to create category",
        );
      }

      await logActivity(
        {
          category: ActionCategory.CATEGORY,
          message: `New Category "${category.name}" was created by ${userName}`,
          performedBy: userName,
          metadata: {
            category: category._id,
          },
        },
        session,
      );

      await session.commitTransaction();

      return category;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
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

  getAllActiveCategory: async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Category.find({ isActive: true}).select("_id name"), query);

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

  updateCategory: async (
    categoryId: string,
    payload: Partial<ICategory>,
    userName: string,
  ) => {
    const session = await startSession();
    session.startTransaction();

    try {
      const category = await Category.findById(categoryId).session(session);
      if (!category) {
        throw new AppError(StatusCodes.NOT_FOUND, "Category Not Found!!");
      }

      if (payload.name && payload.name !== category.name) {
        const uniqueSlug = await slugifyUnique(
          [payload.name as string],
          Category,
          50,
        );
        payload.slug = uniqueSlug;
      }

      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        payload,
        { new: true, runValidators: true, session },
      );

      await logActivity(
        {
          category: ActionCategory.CATEGORY,
          message: `Category "${category.name}" was updated by ${userName}`,
          performedBy: userName,
          metadata: {
            category: category._id,
          },
        },
        session,
      );

      await session.commitTransaction();
      return updatedCategory;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  },

  deleteCategory: async (categoryId: string, userName: string) => {
    const session = await startSession();
    session.startTransaction();

    try {
      // 1. Exist kore kina check kora
      const category = await Category.findById(categoryId).session(session);
      if (!category) {
        throw new AppError(StatusCodes.NOT_FOUND, "Category Not Found!!");
      }

      if (category.isDeleted) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          "Category is already deleted!",
        );
      }


      if (category.availableProducts > 0) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          "Cannot delete category with available products!",
        );
      }

      // 2. Perform Soft Delete
      const deletedCategory = await Category.findByIdAndUpdate(
        categoryId,
        { isDeleted: true },
        { new: true, session },
      );

      await logActivity(
        {
          category: ActionCategory.CATEGORY,
          message: `Category "${category.name}" was deleted by ${userName}`,
          performedBy: userName,
          metadata: {
            category: category._id,
          },
        },
        session,
      );

      await session.commitTransaction();
      return deletedCategory;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  },
};
