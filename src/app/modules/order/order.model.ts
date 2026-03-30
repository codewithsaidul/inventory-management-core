import { Schema, model } from "mongoose";
import { IOrder, OrderStatus } from "./order.interface";

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const OrderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, required: true, trim: true },
    items: [OrderItemSchema],
    totalPrice: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: [...Object.values(OrderStatus)],
      default: OrderStatus.PENDING,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Order = model<IOrder>("Order", OrderSchema);
