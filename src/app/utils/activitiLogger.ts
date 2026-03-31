import { ClientSession } from "mongoose";
import { ActionCategory, IActivitiMetaData } from "../modules/activitiTracking/activitiTracking.interface";
import { ActivitiLog } from "../modules/activitiTracking/activitiTracking.model";


export const logActivity = async (
  {
    category,
    message,
    performedBy = "System",
    metadata,
  }: {
    category: ActionCategory;
    message: string;
    performedBy: string;
    metadata?: IActivitiMetaData;
  },
  session: ClientSession
) => {
  return await ActivitiLog.create(
    [
      {
        category,
        message,
        performedBy,
        metadata,
      },
    ],
    { session }
  );
};