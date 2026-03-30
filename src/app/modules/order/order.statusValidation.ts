import { OrderStatus } from "./order.interface";



const orderStatusFlow: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    [OrderStatus.CONFIRMED]: [OrderStatus.SHIPPED],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELLED]: [],
}



export const isValidStatusTransition = (
  currentStatus: OrderStatus,
  nextStatus: OrderStatus
): boolean => {
  const possibleTransitions = orderStatusFlow[currentStatus];
  return possibleTransitions.includes(nextStatus);
};