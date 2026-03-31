import { Schema, model } from "mongoose";
import { ERestockPriority, IRestockQueue } from "./restock.interface";

const RestockQueueSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },
    currentStock: {
      type: Number,
      required: true,
    },
    threshold: {
      type: Number,
      required: true,
    },
    priority: {
      type: String,
      enum: [...Object.values(ERestockPriority)],
      required: true,
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);



export const RestockQueue = model<IRestockQueue>(
  "RestockQueue",
  RestockQueueSchema
);