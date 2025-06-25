export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED='CONFIRMED',
  QC_CHECK = 'QC_CHECK',
  WAITING_PICKUP='WAITING_PICKUP',
  SHIPPED = 'SHIPPED',
  DELIVERED='DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
  PARTIALLY_RETURNED = 'PARTIALLY_RETURNED',
}

export const OrderStatusPriority: Record<OrderStatus, number> = {
  [OrderStatus.PENDING]: 0,
  [OrderStatus.CONFIRMED]: 1,
  [OrderStatus.QC_CHECK]: 2,
  [OrderStatus.WAITING_PICKUP]: 3,
  [OrderStatus.SHIPPED]: 4,
  [OrderStatus.DELIVERED]: 5,
  [OrderStatus.CANCELLED]: 98,
  [OrderStatus.PARTIALLY_RETURNED]:99,
  [OrderStatus.RETURNED]: 100,
};