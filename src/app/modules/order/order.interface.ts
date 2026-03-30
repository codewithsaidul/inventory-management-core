import { Types } from 'mongoose';

export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
}

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface IOrder {
  customerName: string;
  items: IOrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}