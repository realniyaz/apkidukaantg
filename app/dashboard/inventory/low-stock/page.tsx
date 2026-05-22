"use client"

import { useEffect, useState } from "react"
import { apiRequest } from "@/lib/api"

interface LowStockProduct {
  product_public_id: string
  name: string
  available_stock: number
  threshold: number
}

export default function LowStockPage(){

  const [products,setProducts] = useState<LowStockProduct[]>([])

  useEffect(()=>{

    async function load(){
      const data = await apiRequest<LowStockProduct[]>("/inventory/low-stock")
      setProducts(data)
    }

    load()

  },[])

  return(

    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-black">
        Low Stock Alerts
      </h1>

      <table className="w-full bg-white rounded-3xl shadow">

        <thead>
          <tr>
            <th>Name</th>
            <th>Stock</th>
            <th>Threshold</th>
          </tr>
        </thead>

        <tbody>

          {products.map(p=>(
            <tr key={p.product_public_id}>
              <td>{p.name}</td>
              <td>{p.available_stock}</td>
              <td>{p.threshold}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  )
}