import { Counter } from "../modules/counter/counter.model";

export const generateOrderId = async (): Promise<string> => {
  const counter = await Counter.findOneAndUpdate(
    { id: "order_id" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );

  const sequenceNumber = counter.seq.toString().padStart(6, "0");

  return `ORD-${sequenceNumber}`;
};
