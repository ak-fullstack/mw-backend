export enum StockStage {
  SUPPLIER = 'supplier',
  AVAILABLE = 'available',
  RESERVED='reserved',
  QC_CHECK = 'qc_check',
  WAITING_PICKUP = 'waiting_pickup',
  SHIPPED='shipped',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  RETURNED = 'returned',
  DAMAGED = 'damaged',
  SOLD = 'sold',
}

export const STORAGE: StockStage[] = [
  StockStage.AVAILABLE,
  StockStage.RESERVED,
];