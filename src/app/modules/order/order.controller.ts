/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import { TNext, TRequest, TResponse } from "../../types/global";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { orderServices } from "./order.service";
import { JwtPayload } from "jsonwebtoken";

export const orderControllers = {
  createOrder: catchAsync(
    async (req: TRequest, res: TResponse, next: TNext) => {
      const { userId } = req.user as JwtPayload;
      const result = await orderServices.createOrder(req.body, userId);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "Order placed successfully!",
        data: result,
      });
    },
  ),

  getAllOrders: catchAsync(
    async (req: TRequest, res: TResponse, next: TNext) => {
      const { data, meta } = await orderServices.getAllOrders(
        req.query as Record<string, string>,
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "All orders retrieved successfully!",
        data,
        meta,
      });
    },
  ),

  getOrderDetails: catchAsync(
    async (req: TRequest, res: TResponse, next: TNext) => {
      const { id } = req.params;

      const result = await orderServices.getOrderDetails(id);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Order details retrived successfully!",
        data: result,
      });
    },
  ),

  updateOrderStatus: catchAsync(
    async (req: TRequest, res: TResponse, next: TNext) => {
      const { id } = req.params;
      const { status } = req.body;

      const result = await orderServices.updateOrderStatus(id, status);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Order status updated successfully!",
        data: result,
      });
    },
  ),

  deleteOrder: catchAsync(
    async (req: TRequest, res: TResponse, next: TNext) => {
      const result = await orderServices.deleteOrder(req.params.id as string);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Order deleted successfully!",
        data: result,
      });
    },
  ),
};
