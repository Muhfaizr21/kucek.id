export type ProductionStatus = 
  | 'QUEUED'
  | 'WASHING'
  | 'DRYING'
  | 'IRONING'
  | 'PACKING'
  | 'READY'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus = 'UNPAID' | 'PARTIAL' | 'PAID';

export type DurationType = 'REGULAR' | 'FAST' | 'EXPRESS';

export interface OrderItem {
  id: string;
  name: string;
  category: 'KILOAN' | 'SATUAN';
  quantity: number;
  unit: string;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  perfume: string;
  durationType: DurationType;
  productionStatus: ProductionStatus;
  paymentStatus: PaymentStatus;
  totalWeightKg: number;
  totalAmount: number;
  paidAmount: number;
  createdAt: string;
  estimatedCompletionAt: string;
  specialNotes?: string;
  items: OrderItem[];
}
