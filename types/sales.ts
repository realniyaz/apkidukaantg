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
  product_id?: number; // Optional as backend allows custom items via product_name
  product_name: string;
  quantity: number;
  selling_price: number;
  gst_percent?: number;
  line_total?: number; // Pre-calculated total for the UI
}

export interface Sale {
  id: number;
  invoice_number: string | null; // Nullable for Drafts
  customer_name: string;
  customer_phone: string; // Renamed from phone_number to match Swagger /sales/
  
  // Amounts (Numbers for easy frontend calculation)
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
  // 🟢 FIXED: Lowercase to match backend validation: 'cash' | 'upi' | 'card' | 'bank'
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
 * Specifically for the /cart/checkout endpoint (Legacy/Hybrid support)
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