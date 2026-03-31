import { Schema, model } from "mongoose";
import { IOrder, IOrderHistory, OrderStatus } from "./order.interface";
import { generateOrderId } from "../../utils/generateOrderId";

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
    orderId: { type: String, required: true, unique: true },
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

OrderSchema.pre("save", async function (next) {
  if (!this.orderId) {
    this.orderId = await generateOrderId();
  }
  next();
});

export const Order = model<IOrder>("Order", OrderSchema);
