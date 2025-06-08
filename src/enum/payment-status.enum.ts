export enum PaymentStatus {
  CREATED = 'created',          // Payment created but not yet processed
  PENDING = 'PENDING',          // Payment pending (e.g., waiting for confirmation)
  AUTHORIZED = 'authorized',    // Payment authorized but not yet captured
  PAID = 'PAID',        // Payment successfully captured/paid
  FAILED = 'failed',            // Payment failed or declined
  REFUNDED = 'refunded',        // Payment fully refunded
  PARTIALLY_REFUNDED = 'partially_refunded', // Partial refund issued
  CANCELLED = 'cancelled',      // Payment cancelled before completion
  EXPIRED = 'expired'           // Payment expired without completion
}