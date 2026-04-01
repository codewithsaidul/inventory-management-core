/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import { TNext, TRequest, TResponse } from "../../types/global";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { restockServices } from "./restock.service";
import { JwtPayload } from "jsonwebtoken";

export const restockController = {
  getAllRestockQueues: catchAsync(
    async (req: TRequest, res: TResponse, next: TNext) => {
      const result = await restockServices.getAllRestockQueues(
        req.query as Record<string, string>,
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Restock Queues retrived successfully!",
        data: result,
      });
    },
  ),

  restockItem: catchAsync(
    async (req: TRequest, res: TResponse, next: TNext) => {
      const { userId, name } = req.user as JwtPayload;
      const result = await restockServices.restockItem(
        req.params.id as string,
        req.body,
        userId as string,
        name as string,
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Product restocked successfully!",
        data: result,
      });
    },
  ),
};
