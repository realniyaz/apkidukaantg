export interface ProductDashboard {
  public_id: string;
  name: string;
  current_stock: number;
  current_average_cost: number;
  stock_value: number;
  selling_price: number;
  low_stock_warning: boolean;
  last_updated: string;
}

export interface ProductStaffView {
  public_id: string;
  name: string;
  selling_price: number;
  available_stock: number;
  is_available: boolean;
}

export interface ProductOwnerView extends ProductStaffView {
  cost_price?: number;
  printed_mrp?: number;
  low_stock_threshold?: number;
}
