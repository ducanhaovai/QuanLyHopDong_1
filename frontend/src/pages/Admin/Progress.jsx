import React, { useState, useEffect } from 'react';
import { FaTasks, FaSearch, FaFilter, FaMapMarkerAlt, FaEye, FaSpinner, FaEdit } from 'react-icons/fa';
import { tiendoAPI, userAPI } from '../../service/api.js';

const Progress = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [provinceFilter, setProvinceFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingTiendo, setLoadingTiendo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tiendoData, setTiendoData] = useState({
    ngayks: '',
    ngaytk: '',
    ngaydutoan: '',
    ngaypheduyet: '',
    ngaynhan_dhtc: '',
    trangthai_tc: '',
    nguoiks_id: ''
  });
  
  // Load dữ liệu từ API
  useEffect(() => {
    loadContracts();
    loadUsers();
  }, []);

  // Load lại khi filter thay đổi
  useEffect(() => {
    const timer = setTimeout(() => {
      loadContracts();
    }, 300); // Debounce 300ms cho search

    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, provinceFilter]);

  const loadContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = {
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        province: provinceFilter !== 'all' ? provinceFilter : undefined,
      };
      const data = await tiendoAPI.getAll(filters);
      setContracts(data);
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
      setError(err.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await userAPI.getAll();
      setUsers(data);
    } catch (err) {
      console.error('Lỗi tải danh sách người dùng:', err);
    }
  };

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

  // API đã filter sẵn, chỉ cần dùng contracts trực tiếp
  const filteredContracts = contracts;

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

  const handleUpdateProgress = async () => {
    if (!selectedContract) return;
    
    // Load dữ liệu tiến độ hiện tại
    try {
      setLoadingTiendo(true);
      const currentTiendo = await tiendoAPI.get(selectedContract.id);
      
      if (currentTiendo) {
        setTiendoData({
          ngayks: currentTiendo.ngayks ? currentTiendo.ngayks.split('T')[0] : '',
          ngaytk: currentTiendo.ngaytk ? currentTiendo.ngaytk.split('T')[0] : '',
          ngaydutoan: currentTiendo.ngaydutoan ? currentTiendo.ngaydutoan.split('T')[0] : '',
          ngaypheduyet: currentTiendo.ngaypheduyet ? currentTiendo.ngaypheduyet.split('T')[0] : '',
          ngaynhan_dhtc: currentTiendo.ngaynhan_dhtc ? currentTiendo.ngaynhan_dhtc.split('T')[0] : '',
          trangthai_tc: currentTiendo.trangthai_tc || '',
          nguoiks_id: currentTiendo.nguoiks_id || ''
        });
      } else {
        // Nếu chưa có tiến độ, reset form
        setTiendoData({
          ngayks: '',
          ngaytk: '',
          ngaydutoan: '',
          ngaypheduyet: '',
          ngaynhan_dhtc: '',
          trangthai_tc: '',
          nguoiks_id: ''
        });
      }
      
      setShowModal(false);
      setShowUpdateModal(true);
    } catch (err) {
      console.error('Lỗi tải tiến độ:', err);
      alert('Không thể tải dữ liệu tiến độ');
    } finally {
      setLoadingTiendo(false);
    }
  };

  const handleSaveProgress = async () => {
    if (!selectedContract) return;

    try {
      setSaving(true);
      await tiendoAPI.update(selectedContract.id, tiendoData);
      
      // Reload danh sách
      await loadContracts();
      
      // Đóng modal
      setShowUpdateModal(false);
      setSelectedContract(null);
      
      alert('Cập nhật tiến độ thành công!');
    } catch (err) {
      console.error('Lỗi cập nhật tiến độ:', err);
      alert(err.message || 'Không thể cập nhật tiến độ');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setTiendoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const uniqueProvinces = [...new Set(contracts.map(c => c.province).filter(Boolean))].sort();
  const uniqueStatuses = [...new Set(contracts.map(c => c.status).filter(Boolean))].sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">TIẾN TRÌNH</h1>
          <p className="text-sm text-gray-500 mt-1">Theo dõi tiến độ thực hiện các hợp đồng</p>
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
        )}
      </div>

      {/* Modal Update Progress */}
      {showUpdateModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <FaEdit className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">CẬP NHẬT TIẾN ĐỘ</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedContract.code} - {selectedContract.contractNo}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedContract(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {loadingTiendo ? (
              <div className="flex items-center justify-center py-12">
                <FaSpinner className="w-8 h-8 text-gray-400 animate-spin mr-3" />
                <span className="text-gray-600">Đang tải dữ liệu...</span>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Thông tin hợp đồng */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">THÔNG TIN HỢP ĐỒNG</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Mã trạm:</span>
                      <span className="ml-2 font-medium">{selectedContract.code}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Số hợp đồng:</span>
                      <span className="ml-2 font-medium">{selectedContract.contractNo}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Tỉnh/Thành:</span>
                      <span className="ml-2 font-medium">{selectedContract.province}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Chủ đầu tư:</span>
                      <span className="ml-2 font-medium">{selectedContract.investor}</span>
                    </div>
                  </div>
                </div>

                {/* Form cập nhật tiến độ */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-700">CÁC MỐC TIẾN ĐỘ</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Ngày khảo sát */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ngày khảo sát
                      </label>
                      <input
                        type="date"
                        value={tiendoData.ngayks}
                        onChange={(e) => handleInputChange('ngayks', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    {/* Người khảo sát */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Người khảo sát
                      </label>
                      <select
                        value={tiendoData.nguoiks_id}
                        onChange={(e) => handleInputChange('nguoiks_id', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">-- Chọn người khảo sát --</option>
                        {users.map(user => (
                          <option key={user.id} value={user.id}>
                            {user.ten}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Ngày thiết kế */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ngày thiết kế
                      </label>
                      <input
                        type="date"
                        value={tiendoData.ngaytk}
                        onChange={(e) => handleInputChange('ngaytk', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    {/* Ngày dự toán */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ngày dự toán
                      </label>
                      <input
                        type="date"
                        value={tiendoData.ngaydutoan}
                        onChange={(e) => handleInputChange('ngaydutoan', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    {/* Ngày phê duyệt */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ngày phê duyệt
                      </label>
                      <input
                        type="date"
                        value={tiendoData.ngaypheduyet}
                        onChange={(e) => handleInputChange('ngaypheduyet', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    {/* Ngày nhận ĐHTC */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ngày nhận ĐHTC
                      </label>
                      <input
                        type="date"
                        value={tiendoData.ngaynhan_dhtc}
                        onChange={(e) => handleInputChange('ngaynhan_dhtc', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    {/* Trạng thái thi công */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Trạng thái thi công
                      </label>
                      <select
                        value={tiendoData.trangthai_tc}
                        onChange={(e) => handleInputChange('trangthai_tc', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">-- Chọn trạng thái --</option>
                        <option value="khaosat">Khảo sát</option>
                        <option value="thietke">Thiết kế</option>
                        <option value="dutoan">Dự toán</option>
                        <option value="pheduyet">Phê duyệt</option>
                        <option value="dhtc">ĐHTC</option>
                        <option value="hoanthanh">Hoàn thành</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Thông tin phần trăm hoàn thành */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Lưu ý:</strong> Phần trăm hoàn thành sẽ được tự động tính dựa trên các mốc đã hoàn thành:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Ngày khảo sát: 10%</li>
                      <li>Ngày thiết kế: 20%</li>
                      <li>Ngày dự toán: 20%</li>
                      <li>Ngày phê duyệt: 20%</li>
                      <li>Ngày nhận ĐHTC: 20%</li>
                      <li>Trạng thái thi công: 10%</li>
                    </ul>
                  </p>
                </div>
              </div>
            )}

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedContract(null);
                }}
                disabled={saving}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                HỦY
              </button>
              <button
                onClick={handleSaveProgress}
                disabled={saving || loadingTiendo}
                className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  'LƯU CẬP NHẬT'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
              <button 
                onClick={handleUpdateProgress}
                className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
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

