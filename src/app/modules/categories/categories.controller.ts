/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import { TNext, TRequest, TResponse } from "../../types/global";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { categoryServices } from "./categories.service";
import { updateCategorySchema } from "./categories.validation";
import { JwtPayload } from "jsonwebtoken";

export const categoryControllers = {
  createCategory: catchAsync(
    async (req: TRequest, res: TResponse, next: TNext) => {
      const { name } = req.user as JwtPayload;
      const result = await categoryServices.createCategory(req.body, name);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "Category created successfully!",
        data: result,
      });
    },
  ),

  getAllCateogry: catchAsync(
    async (req: TRequest, res: TResponse, next: TNext) => {
      const { data, meta } = await categoryServices.getAllCategory(
        req.query as Record<string, string>,
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "All Category retrived successfully!",
        data,
        meta,
      });
    },
  ),

  getSingleCategory: catchAsync(
    async (req: TRequest, res: TResponse, next: TNext) => {
      const result = await categoryServices.getSingleCategory(
        req.params.slug as string,
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Category details retrived successfully!",
        data: result,
      });
    },
  ),

  updateCategory: catchAsync(
    async (req: TRequest, res: TResponse, next: TNext) => {
      const { name } = req.user as JwtPayload;
      const result = await categoryServices.updateCategory(
        req.params.id as string,
        req.body,
        name,
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Category updated successfully!",
        data: result,
      });
    },
  ),

  deleteCategory: catchAsync(
    async (req: TRequest, res: TResponse, next: TNext) => {
      const { name } = req.user as JwtPayload;
      const result = await categoryServices.deleteCategory(
        req.params.id as string,
        name,
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Category deleted successfully!",
        data: result,
      });
    },
  ),
};
