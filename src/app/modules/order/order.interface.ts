import { Types } from "mongoose";

export enum OrderStatus {
  PENDING = "Pending",
  CONFIRMED = "Confirmed",
  SHIPPED = "Shipped",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled",
}

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface IOrderHistory {
  status: OrderStatus;
  changedAt: Date;
  changedBy?: Types.ObjectId;
  note?: string;
}

export interface IOrder {
  customerName: string;
  items: IOrderItem[];
  totalPrice: number;
  status: OrderStatus;
  isDeleted: boolean;
  orderHistory: IOrderHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderFillter {
  status?: OrderStatus;
  createdAt?: Date | { $gte: Date; $lte: Date };
}
