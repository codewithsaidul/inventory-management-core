/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import { TNext, TRequest, TResponse } from "../../types/global";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { categoryServices } from "./categories.service";

export const categoryControllers = {
  createCategory: catchAsync(
    async (req: TRequest, res: TResponse, next: TNext) => {
      const result = await categoryServices.createCategory(req.body);

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
      const result = await categoryServices.getAllCategory(
        req.query as Record<string, string>,
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Category retrived successfully!",
        data: result,
      });
    },
  ),
};
