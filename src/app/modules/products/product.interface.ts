import { Types } from 'mongoose';

export enum ProductStatus {
  ACTIVE = 'Active',
  OUT_OF_STOCK = 'Out of Stock',
}

export interface IProduct {
  _id?: string;
  name: string;
  slug: string;
  category: Types.ObjectId;
  price: number;
  stock: number;
  minThreshold: number;
  status: ProductStatus;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}