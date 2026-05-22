export interface InventorySummary {
  total_products: number
  total_stock_value: number
  low_stock_count: number
  dead_stock_count: number
  high_inventory_count: number
}

export interface StockMovement {
  id: number
  movement_type: string
  quantity: number
  direction: string
  created_at: string
}

export interface StockValuationProduct {
  product_public_id: string
  name: string
  available_stock: number
  average_cost: number
  stock_value: number
}

export interface LowStockProduct {
  product_public_id: string
  name: string
  available_stock: number
  threshold: number
}

export interface InventoryAnalytics {
  current_stock: number
  total_sales_last_30_days: number
  average_daily_sales: number
  days_of_stock_remaining: number
  classification: string
  reorder_recommended: boolean
  suggested_reorder_quantity: number
}

export interface LowStockProduct {
  product_public_id: string
  name: string
  available_stock: number
  threshold: number
}