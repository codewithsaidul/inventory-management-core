/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { TNext, TRequest, TResponse } from "../../types/global";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { categoryServices } from "./categories.service";

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

  getAllCategory: catchAsync(
    async (req: TRequest, res: TResponse, next: TNext) => {
      const { data, meta } = await categoryServices.getAllCategory(
        req.query as Record<string, string>,
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "All categories retrieved successfully!",
        data,
        meta,
      });
    },
  ),

  getAllActiveCategory: catchAsync(
    async (req: TRequest, res: TResponse, next: TNext) => {
      const { data, meta } = await categoryServices.getAllActiveCategory(
        req.query as Record<string, string>,
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "All Active categories retrieved successfully!",
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
        message: "Category details retrieved successfully!",
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
