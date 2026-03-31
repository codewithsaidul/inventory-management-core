/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import { TNext, TRequest, TResponse } from "../../types/global";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { restockServices } from "./restock.service";

export const restockController = {
  getAllRestockQueues: catchAsync(
    async (req: TRequest, res: TResponse, next: TNext) => {
      const result = await restockServices.getAllRestockQueues(req.body);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Restock Queues retrived successfully!",
        data: result,
      });
    },
  ),
};
