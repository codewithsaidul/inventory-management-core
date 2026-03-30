/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import { TNext, TRequest, TResponse } from "../../types/global";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { productServices } from "./products.service";

export const productControllers = {
  createProduct: catchAsync(
    async (req: TRequest, res: TResponse, next: TNext) => {
      const result = await productServices.createProduct(req.body);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "Product created successfully!",
        data: result,
      });
    },
  ),

  getAllProduct: catchAsync(
    async (req: TRequest, res: TResponse, next: TNext) => {
      const { data, meta } = await productServices.getAllProducts(
        req.query as Record<string, string>,
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "All Product retrived successfully!",
        data,
        meta,
      });
    },
  ),

  getProductDetails: catchAsync(
    async (req: TRequest, res: TResponse, next: TNext) => {
      const result = await productServices.getProductDetails(
        req.params.slug as string,
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Product details retrived successfully!",
        data: result,
      });
    },
  ),

  updateProduct: catchAsync(
    async (req: TRequest, res: TResponse, next: TNext) => {
      const result = await productServices.updateProduct(
        req.params.id as string,
        req.body,
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Product updated successfully!",
        data: result,
      });
    },
  ),

  deleteProduct: catchAsync(
    async (req: TRequest, res: TResponse, next: TNext) => {
      const result = await productServices.deleteProduct(
        req.params.id as string,
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Product deleted successfully!",
        data: result,
      });
    },
  ),
};
