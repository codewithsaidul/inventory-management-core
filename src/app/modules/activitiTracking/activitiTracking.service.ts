import { QueryBuilder } from "../../utils/queryBuilder";
import { ActivitiLog } from "./activitiTracking.model";

export const activitiTrackingServices = {
  getAllActivities: async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(ActivitiLog.find(), { ...query, sort: "-timestamp"});

    const events = queryBuilder
      .search(["category", "message", "performedBy"])
      .filter()
      .sort()
      .fields()
      .paginate()
      .populate("metadata.product", "name")
      .populate("metadata.category", "name")
      .populate("metadata.order", "orderId customerName");

    const [data, meta] = await Promise.all([
      events.build(),
      queryBuilder.getMeta(),
    ]);

    return { data, meta };
  },
};
