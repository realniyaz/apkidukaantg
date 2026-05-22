export interface Purchase {
  id: number
  public_id: string
  purchase_number: string
  supplier_name: string
  total_amount: number
  paid_amount: number
  status: string
  created_at: string
}

export interface PurchaseListResponse {
  total: number
  page: number
  page_size: number
  data: Purchase[]
}