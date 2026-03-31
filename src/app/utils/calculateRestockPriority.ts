import { ERestockPriority } from "../modules/restock/restock.interface";

export const calculatePriority = (
  currentStock: number,
  threshold: number,
): ERestockPriority => {
  const ratio = currentStock / threshold;

  if (ratio <= 0.3) return ERestockPriority.HIGH;
  if (ratio <= 0.6) return ERestockPriority.MEDIUM;
  return ERestockPriority.LOW;
};
