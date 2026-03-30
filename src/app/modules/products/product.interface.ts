import { Types } from 'mongoose';

export enum ProductStatus {
  ACTIVE = 'Active',
  OUT_OF_STOCK = 'Out of Stock',
}

export interface IProduct {
  name: string;
  slug: string;
  category: Types.ObjectId;
  price: number;
  stock: number;
  minThreshold: number;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
}