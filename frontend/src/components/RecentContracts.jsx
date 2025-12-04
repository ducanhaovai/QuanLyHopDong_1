import React from 'react';
import { FaFileContract } from 'react-icons/fa';
import { COLOR_PALETTE } from '../constants/colors';

const RecentContracts = () => {
  const contracts = [
    { id: 'THA2281', name: 'Trạm Hà Giang 2281', status: 'Đang thi công', progress: 65, date: '15/01/2024', color: COLOR_PALETTE[2] },
    { id: 'NAN1927', name: 'Trạm Nghệ An 1927', status: 'Hoàn thành', progress: 100, date: '10/01/2024', color: COLOR_PALETTE[1] },
    { id: 'BGG0125', name: 'Trạm Bắc Giang 0125', status: 'Chờ thiết kế', progress: 30, date: '20/01/2024', color: COLOR_PALETTE[3] },
    { id: 'QNH3456', name: 'Trạm Quảng Ninh 3456', status: 'Đang thi công', progress: 78, date: '12/01/2024', color: COLOR_PALETTE[0] },
    { id: 'HNI4521', name: 'Trạm Hà Nội 4521', status: 'Hoàn thành', progress: 100, date: '08/01/2024', color: COLOR_PALETTE[1] },
    { id: 'HPG7892', name: 'Trạm Hải Phòng 7892', status: 'Đang thi công', progress: 82, date: '18/01/2024', color: COLOR_PALETTE[4] },
    { id: 'DNG3345', name: 'Trạm Đà Nẵng 3345', status: 'Chờ thiết kế', progress: 25, date: '22/01/2024', color: COLOR_PALETTE[3] },
    { id: 'HCM5678', name: 'Trạm TP.HCM 5678', status: 'Đang thi công', progress: 70, date: '14/01/2024', color: COLOR_PALETTE[2] },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">HỢP ĐỒNG GẦN ĐÂY</h3>
        <FaFileContract className="w-5 h-5 text-gray-800" />
      </div>
      <div className="space-y-4">
        {contracts.map((contract) => (
          <div key={contract.id} className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold text-gray-800">{contract.id}</div>
                <div className="text-sm text-gray-500 mt-1">{contract.name}</div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                contract.status === 'Hoàn thành' ? 'bg-green-100 text-green-700' :
                contract.status === 'Đang thi công' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {contract.status}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">TIẾN ĐỘ</span>
                <span className="text-xs font-semibold text-gray-700">{contract.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all"
                  style={{ backgroundColor: contract.color, width: `${contract.progress}%` }}
                ></div>
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-2">{contract.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentContracts;

