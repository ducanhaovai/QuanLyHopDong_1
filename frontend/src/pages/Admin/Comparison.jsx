import React, { useState } from 'react';
import { FaBalanceScale, FaFileContract, FaFileExcel, FaUpload, FaCheck, FaTimes } from 'react-icons/fa';

const Comparison = () => {
  const [selectedContract, setSelectedContract] = useState('THA2281');
  
  const [comparisons, setComparisons] = useState([
    {
      id: 1,
      contract: 'THA2281',
      contractNo: '1402052-BQLDA/VTNet',
      province: 'Hà Giang',
      items: [
        { id: 1, name: 'Monopole H=30m', volumeHD: 10, actualKSTK: 8, difference: -2, status: 'warning' },
        { id: 2, name: 'Dây co 600x600 H=36m', volumeHD: 6, actualKSTK: 6, difference: 0, status: 'ok' },
        { id: 3, name: 'Tự đứng 3 chân H=42m', volumeHD: 4, actualKSTK: 5, difference: 1, status: 'info' },
        { id: 4, name: 'PMLG C05 dưới đất', volumeHD: 2, actualKSTK: 2, difference: 0, status: 'ok' },
      ]
    },
    {
      id: 2,
      contract: 'NAN1927',
      contractNo: '1402039-BQLDA/VTNet',
      province: 'Nghệ An',
      items: [
        { id: 5, name: 'Monopole H=30m', volumeHD: 8, actualKSTK: 7, difference: -1, status: 'warning' },
        { id: 6, name: 'Dây co 600x600 H=36m', volumeHD: 5, actualKSTK: 5, difference: 0, status: 'ok' },
        { id: 7, name: 'Cột cóc H=6m', volumeHD: 3, actualKSTK: 4, difference: 1, status: 'info' },
      ]
    },
    {
      id: 3,
      contract: 'QNH0001',
      contractNo: '1402015-BQLDA/VTNet',
      province: 'Quảng Ninh',
      items: [
        { id: 8, name: 'Monopole H=35m', volumeHD: 12, actualKSTK: 12, difference: 0, status: 'ok' },
        { id: 9, name: 'Tự đứng 3 chân H=42m', volumeHD: 6, actualKSTK: 6, difference: 0, status: 'ok' },
      ]
    },
  ]);

  // Get current comparison data
  const currentComparison = comparisons.find(c => c.contract === selectedContract) || comparisons[0];
  const currentItems = currentComparison.items;

  const getStatusColor = (status) => {
    const colorMap = {
      'ok': 'bg-green-100 text-green-800',
      'warning': 'bg-red-100 text-red-800',
      'info': 'bg-blue-100 text-blue-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      'ok': '✓ Khớp',
      'warning': '⚠️ Cảnh báo',
      'info': 'ℹ️ Vượt',
    };
    return labelMap[status] || status;
  };

  const getDifferenceColor = (difference) => {
    if (difference < 0) return 'text-red-600';
    if (difference > 0) return 'text-blue-600';
    return 'text-green-600';
  };

  const formatDifference = (difference) => {
    if (difference === 0) return '0';
    if (difference > 0) return `+${difference}`;
    return `${difference}`;
  };

  const calculatePercentage = (difference, volumeHD) => {
    if (volumeHD === 0) return 0;
    return ((difference / volumeHD) * 100).toFixed(1);
  };

  const getPercentageColor = (percentage) => {
    const absPercent = Math.abs(parseFloat(percentage));
    if (absPercent > 10) return 'text-red-600';
    return 'text-gray-600';
  };

  // Calculate totals
  const totalVolumeHD = currentItems.reduce((sum, item) => sum + item.volumeHD, 0);
  const totalActualKSTK = currentItems.reduce((sum, item) => sum + item.actualKSTK, 0);
  const totalDifference = totalActualKSTK - totalVolumeHD;
  const totalPercentage = totalVolumeHD > 0 ? ((totalDifference / totalVolumeHD) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">SO SÁNH THỰC TẾ VS HỢP ĐỒNG</h1>
          <p className="text-sm text-gray-500 mt-1">So sánh khối lượng hợp đồng với thực tế khảo sát thiết kế</p>
        </div>
      </div>

      {/* Contract Selection */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={selectedContract}
            onChange={(e) => setSelectedContract(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
          >
            {comparisons.map(comp => (
              <option key={comp.id} value={comp.contract}>
                {comp.contract} - {comp.province}
              </option>
            ))}
          </select>
          <button className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold">
            <FaUpload className="w-4 h-4" />
            <span>NHẬP KHỐI LƯỢNG KSTK</span>
          </button>
          <button className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold">
            <FaFileExcel className="w-4 h-4" />
            <span>IMPORT TỪ EXCEL</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="text-sm text-gray-600 mb-1">TỔNG VOLUME HĐ</div>
          <div className="text-3xl font-bold mt-2">{totalVolumeHD} cột</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="text-sm text-gray-600 mb-1">THỰC TẾ KSTK</div>
          <div className="text-3xl font-bold mt-2">{totalActualKSTK} cột</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
          <div className="text-sm text-gray-600 mb-1">CHÊNH LỆCH</div>
          <div className={`text-3xl font-bold mt-2 ${getDifferenceColor(totalDifference)}`}>
            {formatDifference(totalDifference)} cột ({totalPercentage > 0 ? '+' : ''}{totalPercentage}%)
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">LOẠI CỘT</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">VOLUME HĐ</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">THỰC TẾ KSTK</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">CHÊNH LỆCH</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">% SAI LỆCH</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <FaBalanceScale className="w-12 h-12 text-gray-300 mb-2" />
                      <p>Không có dữ liệu so sánh</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => {
                  const percentage = calculatePercentage(item.difference, item.volumeHD);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-gray-800">{item.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="font-semibold text-gray-700">{item.volumeHD}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="font-semibold text-gray-700">{item.actualKSTK}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`font-bold text-lg ${getDifferenceColor(item.difference)}`}>
                          {item.difference > 0 ? '+' : ''}{item.difference}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`font-semibold ${getPercentageColor(percentage)}`}>
                          {percentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-semibold text-gray-700">
          <FaTimes className="w-4 h-4" />
          <span>HỦY</span>
        </button>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold">
          <FaCheck className="w-4 h-4" />
          <span>GỬI PHÊ DUYỆT</span>
        </button>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
          <FaFileContract className="w-4 h-4" />
          <span>CẬP NHẬT HĐ</span>
        </button>
      </div>
    </div>
  );
};

export default Comparison;

