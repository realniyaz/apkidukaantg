"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { User } from "@/types/user";
import { motion } from "framer-motion";

export default function RoleDistributionChart({ users }: { users: User[] }) {
  
  // Calculate role distribution
  const roleCounts = users.reduce((acc: any, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(roleCounts).map((role) => ({
    name: role.charAt(0).toUpperCase() + role.slice(1), // Capitalize
    value: roleCounts[role],
  }));

  // Branded Palette: Lime Green, Slate Gray, Emerald, and Light Slate
  const COLORS = ["#84CC16", "#2D3748", "#10B981", "#94A3B8"];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-[400px] flex flex-col"
    >
      <div className="mb-6">
        <h2 className="text-xl font-black text-[#2D3748] tracking-tight">
          Role Distribution
        </h2>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
          Team Composition Overview
        </p>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70} // Creates the classy Donut look
              outerRadius={100}
              paddingAngle={5} // Space between segments
              stroke="none"
              // Classy spring-based animation
              animationBegin={200}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.05))" }}
                />
              ))}
            </Pie>

            <Tooltip 
              contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                padding: '12px'
              }} 
              itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
            />
            
            <Legend 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              formatter={(value) => (
                <span className="text-xs font-black text-gray-500 uppercase tracking-tighter ml-2">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}