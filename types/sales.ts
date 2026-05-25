/**
 * Enum for Sale Status to match Backend SaleStatus
 * Provides type safety for status-based logic and UI badges.
 */
export enum SaleStatus {
  DRAFT = "DRAFT",
  POSTED = "POSTED",
  CANCELLED = "CANCELLED",
}

export interface SaleItem {
  id?: number;
  product_id?: number;
  product_name: string;
  quantity: number;
  selling_price: number;
  gst_percent?: number;
  line_total?: number;
}

export interface Sale {
  id: number;
  invoice_number: string | null;
  
  // Updated to allow nulls as per backend schema (Optional[str] = None)
  customer_name: string | null;
  customer_phone: string | null;
  
  // Amounts
  sub_total: number;
  total_gst: number;
  total_amount: number;
  paid_amount: number;
  
  status: SaleStatus;
  created_at: string;
  posted_at?: string;
  
  // Nested Relations
  items?: SaleItem[];
  payments?: SalePayment[];
}

export interface SalePayment {
  id?: number;
  mode: 'cash' | 'upi' | 'card' | 'bank';
  amount: number;
  created_at?: string;
}

/**
 * Payload for the INITIAL draft creation
 * POST /sales/
 */
export interface InitializeSalePayload {
  customer_name: string;
  customer_phone: string;
}

/**
 * Payload for adding multiple items to a sale
 * POST /sales/{sale_id}/items
 */
export interface AddItemsPayload {
  items: Array<{
    product_name: string;
    quantity: number;
    selling_price: number;
  }>;
}

/**
 * Specifically for the /cart/checkout endpoint
 */
export interface SaleCreatePayload {
  customer_name: string;
  customer_phone: string;
  items: Array<{
    product_id?: number;
    product_name: string;
    quantity: number;
    selling_price: number;
  }>;
}