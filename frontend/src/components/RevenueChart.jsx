import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FaDollarSign } from 'react-icons/fa';
import { CHART_COLORS } from '../constants/colors';

const RevenueChart = () => {
  const revenueData = [
    { month: 'T1', revenue: 45, target: 50 },
    { month: 'T2', revenue: 52, target: 55 },
    { month: 'T3', revenue: 61, target: 60 },
    { month: 'T4', revenue: 58, target: 65 },
    { month: 'T5', revenue: 68, target: 70 },
    { month: 'T6', revenue: 75, target: 75 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">DOANH THU THEO THÁNG</h3>
          <p className="text-sm text-gray-500">ĐƠN VỊ: TỶ VNĐ</p>
        </div>
        <FaDollarSign className="w-5 h-5 text-gray-800" />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke={CHART_COLORS.RED} 
            strokeWidth={3}
            name="THỰC TẾ"
            dot={{ fill: CHART_COLORS.RED, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="target" 
            stroke={CHART_COLORS.PINK} 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="MỤC TIÊU"
            dot={{ fill: CHART_COLORS.PINK, r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;

