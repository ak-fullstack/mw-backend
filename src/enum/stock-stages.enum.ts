export enum StockStage {
  SUPPLIER = 'supplier',
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  QC_CHECK = 'qc_check',
  WAITING_PICKUP = 'waiting_pickup',
  SHIPPED = 'shipped',
  IN_TRANSIT_TO_CUSTOMER = 'in_transit_to_customer',
  IN_TRANSIT_TO_SELLER = 'in_transit_to_seller',
  DELIVERED = 'delivered',
  RETURNED = 'returned',
  DAMAGED = 'damaged',
}

export const STORAGE: StockStage[] = [
  StockStage.AVAILABLE,
  StockStage.RESERVED,
];