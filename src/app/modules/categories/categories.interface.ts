



export interface ICategory {
  name: string;
  slug: string;
  availableProducts: number;
  description?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}