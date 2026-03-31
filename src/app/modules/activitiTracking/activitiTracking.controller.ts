import { StatusCodes } from "http-status-codes";
import { TNext, TRequest, TResponse } from "../../types/global";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { activitiTrackingServices } from "./activitiTracking.service";

export const activitiTrackingController = {
  getAllActivities: catchAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (req: TRequest, res: TResponse, next: TNext) => {
      const { data, meta } = await activitiTrackingServices.getAllActivities(
        req.query as Record<string, string>,
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "Product created successfully!",
        data,
        meta,
      });
    },
  ),
};
