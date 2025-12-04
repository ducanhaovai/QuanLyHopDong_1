import React, { useState } from 'react';
import { FaTasks, FaSearch, FaFilter, FaMapMarkerAlt, FaEye } from 'react-icons/fa';

const Progress = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [provinceFilter, setProvinceFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  
  const [contracts, setContracts] = useState([
    { id: 1, code: 'THA2281', contractNo: '1402052-BQLDA/VTNet', province: 'Hà Giang', status: 'Đang thi công', progress: 65, value: 998164663, investor: 'ANTHANHSON', date: '2025-02-14' },
    { id: 2, code: 'NAN1927', contractNo: '1402039-BQLDA/VTNet', province: 'Nghệ An', status: 'ĐHTC', progress: 45, value: 856234500, investor: 'ANTHANHSON', date: '2025-02-14' },
    { id: 3, code: 'QNH0001', contractNo: '1402015-BQLDA/VTNet', province: 'Quảng Ninh', status: 'Hoàn thành', progress: 100, value: 1245678900, investor: 'VTK', date: '2025-02-14' },
    { id: 4, code: 'BGG0125', contractNo: '23620241-BQLDA/VTNet', province: 'Bắc Giang', status: 'Thiết kế', progress: 30, value: 675432100, investor: 'VTK', date: '2024-06-23' },
    { id: 5, code: 'BKN0089', contractNo: '26620242-BQLDA/VTNet', province: 'Bắc Kạn', status: 'Khảo sát', progress: 20, value: 534890000, investor: 'VTK', date: '2024-06-26' },
  ]);

  const getStatusColor = (status) => {
    const colorMap = {
      'Khảo sát': 'bg-gray-100 text-gray-700',
      'Thiết kế': 'bg-blue-100 text-blue-700',
      'Đang thi công': 'bg-yellow-100 text-yellow-700',
      'ĐHTC': 'bg-orange-100 text-orange-700',
      'Hoàn thành': 'bg-green-100 text-green-700'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-700';
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return '#10B981'; // green
    if (progress >= 70) return '#3B82F6'; // blue
    if (progress >= 40) return '#F59E0B'; // yellow
    return '#EF4444'; // red
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contractNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.investor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesProvince = provinceFilter === 'all' || contract.province === provinceFilter;
    
    return matchesSearch && matchesStatus && matchesProvince;
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const handleView = (contract) => {
    setSelectedContract(contract);
    setShowModal(true);
  };

  const uniqueProvinces = [...new Set(contracts.map(c => c.province))].sort();
  const uniqueStatuses = [...new Set(contracts.map(c => c.status))].sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">TIẾN TRÌNH</h1>
          <p className="text-sm text-gray-500 mt-1">Theo dõi tiến độ thực hiện các hợp đồng</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã trạm, số hợp đồng, tỉnh thành..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">TẤT CẢ TRẠNG THÁI</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Province Filter */}
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">TẤT CẢ TỈNH/THÀNH</option>
              {uniqueProvinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">TỔNG HỢP ĐỒNG</div>
          <div className="text-2xl font-bold text-gray-800">{contracts.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">ĐANG THI CÔNG</div>
          <div className="text-2xl font-bold text-yellow-600">
            {contracts.filter(c => c.status === 'Đang thi công' || c.status === 'ĐHTC').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">HOÀN THÀNH</div>
          <div className="text-2xl font-bold text-green-600">
            {contracts.filter(c => c.status === 'Hoàn thành').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">TIẾN ĐỘ TB</div>
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(contracts.reduce((sum, c) => sum + c.progress, 0) / contracts.length)}%
          </div>
        </div>
      </div>

      {/* Progress List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">MÃ TRẠM</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SỐ HỢP ĐỒNG</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">TỈNH/THÀNH</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">CHỦ ĐẦU TƯ</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">NGÀY KÝ</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">TIẾN ĐỘ</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">TRẠNG THÁI</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">GIÁ TRỊ</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <FaTasks className="w-12 h-12 text-gray-300 mb-2" />
                      <p>Không tìm thấy hợp đồng nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredContracts.map((contract, index) => (
                  <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FaTasks className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-800">{contract.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{contract.contractNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{contract.province}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{contract.investor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{formatDate(contract.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              backgroundColor: getProgressColor(contract.progress),
                              width: `${contract.progress}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-12">{contract.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-800">{formatCurrency(contract.value)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleView(contract)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold flex items-center gap-2"
                      >
                        <FaEye className="w-4 h-4" />
                        <span>XEM</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal View Contract */}
      {showModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FaTasks className="w-6 h-6 text-gray-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">CHI TIẾT TIẾN TRÌNH</h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-500">MÃ TRẠM</label>
                  <p className="text-gray-800 font-medium mt-1">{selectedContract.code}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500">SỐ HỢP ĐỒNG</label>
                  <p className="text-gray-800 font-medium mt-1">{selectedContract.contractNo}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500">TỈNH/THÀNH</label>
                  <p className="text-gray-800 font-medium mt-1">{selectedContract.province}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500">CHỦ ĐẦU TƯ</label>
                  <p className="text-gray-800 font-medium mt-1">{selectedContract.investor}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500">NGÀY KÝ</label>
                  <p className="text-gray-800 font-medium mt-1">{formatDate(selectedContract.date)}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500">TRẠNG THÁI</label>
                  <p className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedContract.status)}`}>
                      {selectedContract.status}
                    </span>
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-500">TIẾN ĐỘ</label>
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Hoàn thành</span>
                      <span className="text-sm font-bold text-gray-800">{selectedContract.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="h-4 rounded-full transition-all"
                        style={{
                          backgroundColor: getProgressColor(selectedContract.progress),
                          width: `${selectedContract.progress}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-500">GIÁ TRỊ HỢP ĐỒNG</label>
                  <p className="text-gray-800 font-bold text-lg mt-1">{formatCurrency(selectedContract.value)}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ĐÓNG
              </button>
              <button className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
                CẬP NHẬT TIẾN ĐỘ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;

