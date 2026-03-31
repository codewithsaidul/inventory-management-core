import { Schema, model } from "mongoose";

interface ICounter {
  id: string;
  seq: number;
}

const CounterSchema = new Schema<ICounter>({
  id: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

export const Counter = model<ICounter>("Counter", CounterSchema);