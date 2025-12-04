import React from 'react';
import { 
  FaFileContract, 
  FaCheckCircle, 
  FaSpinner, 
  FaExclamationTriangle
} from 'react-icons/fa';
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi';

const SummaryCards = () => {
  const summaryData = [
    { 
      title: 'TỔNG HỢP ĐỒNG', 
      value: '1,647', 
      change: '+12.5%',
      trend: 'up',
      icon: FaFileContract, 
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    { 
      title: 'ĐÃ HOÀN THÀNH', 
      value: '640', 
      change: '+8.2%',
      trend: 'up',
      icon: FaCheckCircle, 
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    { 
      title: 'ĐANG THI CÔNG', 
      value: '823', 
      change: '+5.1%',
      trend: 'up',
      icon: FaSpinner, 
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    { 
      title: 'TRỄ TIẾN ĐỘ', 
      value: '184', 
      change: '-3.4%',
      trend: 'down',
      icon: FaExclamationTriangle, 
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryData.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${item.bgColor}`}>
                <Icon className={`w-6 h-6 ${item.iconColor}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${
                item.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.trend === 'up' ? (
                  <HiTrendingUp className="w-4 h-4" />
                ) : (
                  <HiTrendingDown className="w-4 h-4" />
                )}
                <span>{item.change}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">{item.title}</p>
              <p className="text-3xl font-bold text-gray-800">{item.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;

