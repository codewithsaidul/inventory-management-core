import { Schema, model } from "mongoose";
import { IOrder, IOrderHistory, OrderStatus } from "./order.interface";

const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const OrderHistorySchema = new Schema<IOrderHistory>(
  {
    status: {
      type: String,
      enum: [...Object.values(OrderStatus)],
      required: true,
    },
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: Schema.Types.ObjectId, ref: "User" },
    note: { type: String, trim: true },
  },
  { _id: false },
);

const OrderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, required: true, trim: true },
    items: [OrderItemSchema],
    totalPrice: { type: Number, required: true, default: 0 },
    isDeleted: { type: Boolean, default: false },
    status: {
      type: String,
      enum: [...Object.values(OrderStatus)],
      default: OrderStatus.PENDING,
    },
    orderHistory: [OrderHistorySchema],
  },
  { timestamps: true, versionKey: false },
);

export const Order = model<IOrder>("Order", OrderSchema);
