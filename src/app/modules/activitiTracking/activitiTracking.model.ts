import { Schema, model } from "mongoose";
import {
  ActionCategory,
  IActivitiMetaData,
  IActivitiLog,
} from "./activitiTracking.interface";

const ActivitiMetaDataSchema = new Schema<IActivitiMetaData>({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "Order",
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  previousValue: {
    type: String,
  },
  newValue: {
    type: String,
  },
}, { _id: false });

const ActivitiLogSchema = new Schema<IActivitiLog>(
  {
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(ActionCategory),
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    performedBy: {
      type: String,
      required: true,
    },

    metadata: {
      type: ActivitiMetaDataSchema,
      required: false,
    }
  },
  {
    versionKey: false,
    timestamps: false,
  },
);

ActivitiLogSchema.index({ timestamp: -1 });

export const ActivitiLog = model<IActivitiLog>(
  "ActivitiLog",
  ActivitiLogSchema,
);
