"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { User } from "@/types/user";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function RoleDistributionChart({ users }: { users: User[] }) {
  const [isMobile, setIsMobile] = useState(false);

  // Monitor viewport dimensions dynamically to scale chart radii safely on touch screens
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);
  
  // Calculate role distribution
  const roleCounts = users.reduce((acc: any, user) => {
    const roleKey = user.role === "admin" ? "Administrator" : user.role.charAt(0).toUpperCase() + user.role.slice(1);
    acc[roleKey] = (acc[roleKey] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(roleCounts).map((role) => ({
    name: role,
    value: roleCounts[role],
  }));

  // Branded Palette: Lime Green, Slate Gray, Emerald, and Light Slate
  const COLORS = ["#84CC16", "#2D3748", "#10B981", "#94A3B8"];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm h-[360px] sm:h-[400px] flex flex-col w-full"
    >
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-black text-[#2D3748] tracking-tight uppercase italic">
          Role Allocation
        </h2>
        <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">
          Staff Composition Summary
        </p>
      </div>

      <div className="flex-1 w-full relative min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, bottom: 10, left: 0 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              innerRadius={isMobile ? 50 : 70} 
              outerRadius={isMobile ? 75 : 100}
              paddingAngle={4} 
              stroke="none"
              animationBegin={100}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  style={{ filter: "drop-shadow(0px 3px 4px rgba(0,0,0,0.04))" }}
                />
              ))}
            </Pie>

            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
                padding: '10px'
              }} 
              itemStyle={{ fontWeight: 'bold', fontSize: '12px', color: '#2D3748' }}
            />
            
            <Legend 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ bottom: 0, fontSize: '11px' }}
              formatter={(value) => (
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide ml-1.5">
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