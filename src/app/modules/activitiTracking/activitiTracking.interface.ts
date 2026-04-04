import { Types } from "mongoose";

export enum ActionCategory {
  ORDER = 'ORDER',
  STOCK = 'STOCK',
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
  SYSTEM = 'SYSTEM'
}


export interface IActivitiMetaData {
    order?: Types.ObjectId;
    product?: Types.ObjectId;
    category?: Types.ObjectId;
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