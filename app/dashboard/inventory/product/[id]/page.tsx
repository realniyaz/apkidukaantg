"use client"

import { useEffect,useState } from "react"
import { apiRequest } from "@/lib/api"

export default function ProductAnalytics({params}:any){

  const [analytics,setAnalytics] = useState<any>(null)

  useEffect(()=>{
    apiRequest(`/inventory/${params.id}/analytics`)
      .then(setAnalytics)
  },[])

  if(!analytics) return <div>Loading...</div>

  return(

    <div className="space-y-6">

      <h1 className="text-3xl font-black">
        Product Inventory Intelligence
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <Card label="Current Stock" value={analytics.current_stock}/>
        <Card label="Daily Sales" value={analytics.average_daily_sales}/>
        <Card label="Days Remaining" value={analytics.days_of_stock_remaining}/>
        <Card label="Classification" value={analytics.classification}/>
        <Card label="Reorder Needed" value={analytics.reorder_recommended ? "Yes":"No"}/>
        <Card label="Suggested Reorder" value={analytics.suggested_reorder_quantity}/>

      </div>

    </div>
  )
}

function Card({label,value}:any){
  return(
    <div className="bg-white p-6 rounded-3xl shadow border border-gray-100">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-3xl font-black">{value}</p>
    </div>
  )
}