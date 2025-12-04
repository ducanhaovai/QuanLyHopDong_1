import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { COLOR_PALETTE } from '../constants/colors';

const ProvinceProgress = () => {
  const provinceData = [
    { province: 'Hà Nội', progress: 85, contracts: 245, color: COLOR_PALETTE[0] },
    { province: 'Nghệ An', progress: 72, contracts: 189, color: COLOR_PALETTE[1] },
    { province: 'Quảng Ninh', progress: 90, contracts: 156, color: COLOR_PALETTE[2] },
    { province: 'Hà Giang', progress: 65, contracts: 98, color: COLOR_PALETTE[3] },
    { province: 'Bắc Giang', progress: 58, contracts: 134, color: COLOR_PALETTE[4] },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">TIẾN ĐỘ THEO TỈNH</h3>
          <p className="text-sm text-gray-500">PHẦN TRĂM HOÀN THÀNH</p>
        </div>
        <FaMapMarkerAlt className="w-5 h-5 text-gray-800" />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={provinceData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="province" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={80}
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
          <Bar 
            dataKey="progress" 
            radius={[8, 8, 0, 0]}
            name="TIẾN ĐỘ (%)"
          >
            {provinceData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProvinceProgress;

