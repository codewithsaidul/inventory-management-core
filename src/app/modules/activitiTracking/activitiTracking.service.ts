import { QueryBuilder } from "../../utils/queryBuilder";
import { ActivitiLog } from "./activitiTracking.model";

export const activitiTrackingServices = {
  getAllActivities: async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(ActivitiLog.find(), query);

    const events = queryBuilder
      .search(["category", "message", "performedBy"])
      .filter()
      .sort()
      .fields()
      .paginate()
      .populate("metadata.productId", "name")
      .populate("metadata.categoryId", "name")
      .populate("metadata.orderId", "orderNumber");

    const [data, meta] = await Promise.all([
      events.build(),
      queryBuilder.getMeta(),
    ]);

    return { data, meta };
  },
};
