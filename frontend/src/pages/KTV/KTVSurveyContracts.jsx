import React, { useState, useEffect } from 'react';
import { FaClipboardList, FaSearch, FaSpinner, FaCheckCircle, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { tiendoAPI } from '../../service/api.js';

const KTVSurveyContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tiendoAPI.getKTVContracts();
      setContracts(data);
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
      setError(err.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const filteredContracts = contracts.filter(contract => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contract.contractNo.toLowerCase().includes(searchLower) ||
      contract.code.toLowerCase().includes(searchLower) ||
      contract.province.toLowerCase().includes(searchLower) ||
      contract.investor.toLowerCase().includes(searchLower)
    );
  });

  const handleViewDetail = (contractId) => {
    navigate(`/ktv/survey/${contractId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">HỢP ĐỒNG CẦN KHẢO SÁT</h1>
          <p className="text-sm text-gray-500 mt-1">Danh sách hợp đồng được phân công cho bạn</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Lỗi: {error}</p>
          <button 
            onClick={loadContracts}
            className="mt-2 text-sm underline hover:text-red-900"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
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
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">TỔNG HỢP ĐỒNG</div>
          <div className="text-2xl font-bold text-gray-800">{contracts.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">ĐÃ KHẢO SÁT</div>
          <div className="text-2xl font-bold text-green-600">
            {contracts.filter(c => c.daKhaosat).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">CHƯA KHẢO SÁT</div>
          <div className="text-2xl font-bold text-yellow-600">
            {contracts.filter(c => !c.daKhaosat).length}
          </div>
        </div>
      </div>

      {/* Contracts List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="w-8 h-8 text-gray-400 animate-spin mr-3" />
            <span className="text-gray-600">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">MÃ TRẠM</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SỐ HỢP ĐỒNG</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">TỈNH/THÀNH</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">CHỦ ĐẦU TƯ</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">NGÀY KÝ</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">NGÀY KHẢO SÁT</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">GIÁ TRỊ</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">TRẠNG THÁI</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContracts.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <FaClipboardList className="w-12 h-12 text-gray-300 mb-2" />
                        <p>{searchTerm ? 'Không tìm thấy hợp đồng nào' : 'Chưa có hợp đồng nào được phân công'}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredContracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FaClipboardList className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-800">{contract.code}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{contract.contractNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{contract.province}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{contract.investor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{formatDate(contract.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{formatDate(contract.ngayks)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-gray-800">{formatCurrency(contract.value)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {contract.daKhaosat ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                            <FaCheckCircle className="w-3 h-3" />
                            Đã khảo sát
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 flex items-center gap-1 w-fit">
                            <FaClock className="w-3 h-3" />
                            Chưa khảo sát
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewDetail(contract.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                        >
                          {contract.daKhaosat ? 'XEM/CHỈNH SỬA' : 'KHẢO SÁT'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default KTVSurveyContracts;

