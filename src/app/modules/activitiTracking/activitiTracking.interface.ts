import { Types } from "mongoose";

export enum ActionCategory {
  ORDER = 'ORDER',
  STOCK = 'STOCK',
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
  SYSTEM = 'SYSTEM'
}


export interface IActivitiMetaData {
    orderId?: Types.ObjectId;
    productId?: Types.ObjectId;
    categoryId?: Types.ObjectId;
    previousValue?: string;
    newValue?: string;
}

export interface IActivitiLog {
  timestamp: Date;
  category: ActionCategory;
  message: string;
  performedBy: string;
  metadata?: IActivitiMetaData;
}