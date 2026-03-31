import { Types } from "mongoose";



export enum ERestockPriority {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export interface IRestockQueue {
  product: Types.ObjectId;
  currentStock: number;
  threshold: number;
  priority: ERestockPriority;
  isResolved: boolean;
  resolvedBy?: Types.ObjectId;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}