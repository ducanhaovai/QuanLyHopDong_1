import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import { FaChartLine } from 'react-icons/fa';
import { COLOR_PALETTE } from '../constants/colors';

const ProjectDistribution = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  
  const projectData = [
    { name: 'BTS Mới', value: 474, color: COLOR_PALETTE[0] },
    { name: 'Kiên Cố', value: 1173, color: COLOR_PALETTE[1] },
    { name: 'Nâng cấp', value: 356, color: COLOR_PALETTE[2] },
    { name: 'Bảo trì', value: 289, color: COLOR_PALETTE[3] },
  ];

  const total = projectData.reduce((sum, item) => sum + item.value, 0);

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Hide label for small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percent = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: data.payload.color }}
            ></div>
            <p className="font-semibold text-gray-800">{data.payload.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">{data.value.toLocaleString()}</span> dự án
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">{percent}%</span> tổng số
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div 
            key={index} 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
          >
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-sm font-medium text-gray-700">{entry.value}</span>
            <span className="text-sm text-gray-500">
              ({((entry.payload.value / total) * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    );
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">PHÂN BỔ DỰ ÁN</h3>
        <FaChartLine className="w-5 h-5 text-gray-800" />
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie 
            data={projectData} 
            dataKey="value" 
            nameKey="name" 
            cx="50%" 
            cy="50%" 
            innerRadius={60}
            outerRadius={120}
            paddingAngle={3}
            label={CustomLabel}
            labelLine={false}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
            activeIndex={activeIndex}
            activeShape={{
              outerRadius: 130,
              innerRadius: 50,
            }}
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
          >
            {projectData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                stroke={entry.color}
                strokeWidth={activeIndex === index ? 3 : 1}
                style={{
                  filter: activeIndex === index ? 'brightness(1.1)' : 'none',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectDistribution;

