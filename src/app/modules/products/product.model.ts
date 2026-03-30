import { Schema, model } from 'mongoose';
import { IProduct, ProductStatus } from './product.interface';

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    minThreshold: { type: Number, default: 5 },
    status: {
      type: String,
      enum: Object.values(ProductStatus),
      default: ProductStatus.ACTIVE,
    },
  },
  { timestamps: true, versionKey: false }
);


ProductSchema.pre('save', function (next) {
  if (this.stock <= 0) {
    this.status = ProductStatus.OUT_OF_STOCK;
  } else {
    this.status = ProductStatus.ACTIVE;
  }
  next();
});

export const Product = model<IProduct>('Product', ProductSchema);