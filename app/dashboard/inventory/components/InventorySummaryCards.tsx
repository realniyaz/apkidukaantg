import { Boxes, AlertTriangle, PackageX, TrendingUp } from "lucide-react"

export default function InventorySummaryCards({summary}:any){

  const cards = [
    {
      label:"Total Products",
      value:summary.total_products,
      icon:<Boxes size={22}/>
    },
    {
      label:"Stock Value",
      value:`₹${summary.total_stock_value}`,
      icon:<TrendingUp size={22}/>
    },
    {
      label:"Low Stock",
      value:summary.low_stock_count,
      icon:<AlertTriangle size={22}/>
    },
    {
      label:"Dead Stock",
      value:summary.dead_stock_count,
      icon:<PackageX size={22}/>
    }
  ]

  return(
    <div className="grid grid-cols-4 gap-6">

      {cards.map((c,i)=>(
        <div key={i}
        className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">
                {c.label}
              </p>
              <p className="text-3xl font-black text-[#2D3748]">
                {c.value}
              </p>
            </div>

            <div className="p-4 bg-[#F0FDF4] rounded-xl text-[#84CC16]">
              {c.icon}
            </div>
          </div>

        </div>
      ))}

    </div>
  )
}