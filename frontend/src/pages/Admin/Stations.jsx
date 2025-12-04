import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';
import { tramAPI, tinhAPI } from '../../service/api';

const Stations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tinhFilter, setTinhFilter] = useState('all');
  const [loaiProjectFilter, setLoaiProjectFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [stations, setStations] = useState([]);
  const [tinhThanhList, setTinhThanhList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    matram: '',
    tinhthanh_id: '',
    diachi: '',
    loaiproject: 'btsmoi'
  });

  // Load dữ liệu
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [stationsData, tinhData] = await Promise.all([
        tramAPI.getAll(),
        tinhAPI.getAll()
      ]);
      setStations(stationsData);
      setTinhThanhList(tinhData);
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLoaiProjectLabel = (loai) => {
    const labelMap = {
      'btsmoi': 'BTS Mới',
      'kienco': 'Kiên Cố'
    };
    return labelMap[loai] || loai;
  };

  const getLoaiProjectColor = (loai) => {
    const colorMap = {
      'btsmoi': 'bg-blue-100 text-blue-700',
      'kienco': 'bg-green-100 text-green-700'
    };
    return colorMap[loai] || 'bg-gray-100 text-gray-700';
  };

  const filteredStations = stations.filter(station => {
    const matchesSearch = 
      station.matram?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.diachi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.tinhthanh_ten?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTinh = tinhFilter === 'all' || station.tinhthanh_id?.toString() === tinhFilter;
    const matchesLoai = loaiProjectFilter === 'all' || station.loaiproject === loaiProjectFilter;
    
    return matchesSearch && matchesTinh && matchesLoai;
  });

  // Nhóm trạm theo tỉnh thành
  const groupedByTinh = filteredStations.reduce((acc, station) => {
    const tinhId = station.tinhthanh_id || 'unknown';
    const tinhTen = station.tinhthanh_ten || 'Chưa xác định';
    
    if (!acc[tinhId]) {
      acc[tinhId] = {
        tinhId,
        tinhTen,
        tinhMa: station.tinhthanh_ma || '',
        stations: []
      };
    }
    acc[tinhId].stations.push(station);
    return acc;
  }, {});

  const groupedStations = Object.values(groupedByTinh).sort((a, b) => 
    a.tinhTen.localeCompare(b.tinhTen)
  );

  const handleView = (station) => {
    setSelectedStation(station);
    setShowModal(true);
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setFormData({
      matram: '',
      tinhthanh_id: '',
      diachi: '',
      loaiproject: 'btsmoi'
    });
    setError('');
    setShowFormModal(true);
  };

  const handleEdit = (station) => {
    setIsEditMode(true);
    setSelectedStation(station);
    setFormData({
      matram: station.matram || '',
      tinhthanh_id: station.tinhthanh_id?.toString() || '',
      diachi: station.diachi || '',
      loaiproject: station.loaiproject || 'btsmoi'
    });
    setError('');
    setShowModal(false);
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa trạm này?')) {
      try {
        await tramAPI.delete(id);
        await loadData();
      } catch (error) {
        alert('Lỗi khi xóa trạm: ' + (error.message || 'Lỗi server'));
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.matram.trim()) {
      setError('Mã trạm là bắt buộc');
      return false;
    }
    if (!formData.tinhthanh_id) {
      setError('Tỉnh thành là bắt buộc');
      return false;
    }
    if (!formData.loaiproject) {
      setError('Loại project là bắt buộc');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      const submitData = {
        matram: formData.matram.trim(),
        tinhthanh_id: parseInt(formData.tinhthanh_id),
        diachi: formData.diachi.trim() || null,
        loaiproject: formData.loaiproject
      };

      if (isEditMode && selectedStation) {
        await tramAPI.update(selectedStation.id, submitData);
      } else {
        await tramAPI.create(submitData);
      }

      setShowFormModal(false);
      await loadData();
    } catch (error) {
      setError(error.message || 'Lỗi khi lưu trạm');
    } finally {
      setSaving(false);
    }
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setFormData({
      matram: '',
      tinhthanh_id: '',
      diachi: '',
      loaiproject: 'btsmoi'
    });
    setError('');
    setSelectedStation(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">QUẢN LÝ TRẠM</h1>
          <p className="text-sm text-gray-500 mt-1">Danh sách trạm theo tỉnh thành</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors shadow-sm font-semibold"
        >
          <FaPlus className="w-4 h-4" />
          <span>THÊM TRẠM</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã trạm, địa chỉ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Tỉnh Filter */}
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={tinhFilter}
              onChange={(e) => setTinhFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">TẤT CẢ TỈNH THÀNH</option>
              {tinhThanhList.map(tinh => (
                <option key={tinh.id} value={tinh.id.toString()}>
                  {tinh.ma} - {tinh.ten}
                </option>
              ))}
            </select>
          </div>

          {/* Loại Project Filter */}
          <div className="relative">
            <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={loaiProjectFilter}
              onChange={(e) => setLoaiProjectFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">TẤT CẢ LOẠI</option>
              <option value="btsmoi">BTS Mới</option>
              <option value="kienco">Kiên Cố</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">TỔNG SỐ TRẠM</div>
          <div className="text-2xl font-bold text-gray-800">{stations.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">BTS MỚI</div>
          <div className="text-2xl font-bold text-blue-600">
            {stations.filter(s => s.loaiproject === 'btsmoi').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">KIÊN CỐ</div>
          <div className="text-2xl font-bold text-green-600">
            {stations.filter(s => s.loaiproject === 'kienco').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">SỐ TỈNH THÀNH</div>
          <div className="text-2xl font-bold text-purple-600">
            {groupedStations.length}
          </div>
        </div>
      </div>

      {/* Stations List Grouped by Province */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      ) : groupedStations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <FaMapMarkerAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Không tìm thấy trạm nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedStations.map((group) => (
            <div key={group.tinhId} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Province Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {group.tinhMa} - {group.tinhTen}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {group.stations.length} trạm
                    </p>
                  </div>
                </div>
              </div>

              {/* Stations Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Mã trạm
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Địa chỉ
                      </th>
                      <th className="text-center py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Loại project
                      </th>
                      <th className="text-center py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {group.stations.map((station) => (
                      <tr key={station.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-semibold text-gray-800">{station.matram}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-600">
                            {station.diachi || 'Chưa có địa chỉ'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getLoaiProjectColor(station.loaiproject)}`}>
                            {getLoaiProjectLabel(station.loaiproject)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleView(station)}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                              title="Xem chi tiết"
                            >
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(station)}
                              className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(station.id)}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              title="Xóa"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal View Station */}
      {showModal && selectedStation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FaBuilding className="w-6 h-6 text-gray-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">CHI TIẾT TRẠM</h2>
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
                  <p className="text-gray-800 font-medium mt-1">{selectedStation.matram}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500">TỈNH THÀNH</label>
                  <p className="text-gray-800 font-medium mt-1">
                    {selectedStation.tinhthanh_ma} - {selectedStation.tinhthanh_ten}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-500">ĐỊA CHỈ</label>
                  <p className="text-gray-800 mt-1">{selectedStation.diachi || 'Chưa có địa chỉ'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500">LOẠI PROJECT</label>
                  <p className="mt-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getLoaiProjectColor(selectedStation.loaiproject)}`}>
                      {getLoaiProjectLabel(selectedStation.loaiproject)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ĐÓNG
              </button>
              <button 
                onClick={() => {
                  setShowModal(false);
                  handleEdit(selectedStation);
                }}
                className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                CHỈNH SỬA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form Add/Edit Station */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FaBuilding className="w-6 h-6 text-gray-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {isEditMode ? 'CHỈNH SỬA TRẠM' : 'THÊM TRẠM MỚI'}
                  </h2>
                </div>
                <button
                  onClick={handleCloseFormModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-lg">
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {/* Mã trạm */}
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      MÃ TRẠM <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.matram}
                      onChange={(e) => handleInputChange('matram', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="VD: THA2281"
                      required
                    />
                  </div>

                  {/* Tỉnh thành */}
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      TỈNH THÀNH <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.tinhthanh_id}
                      onChange={(e) => handleInputChange('tinhthanh_id', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
                      required
                    >
                      <option value="">Chọn tỉnh thành</option>
                      {tinhThanhList.map(tinh => (
                        <option key={tinh.id} value={tinh.id.toString()}>
                          {tinh.ma} - {tinh.ten}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Địa chỉ */}
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ĐỊA CHỈ
                    </label>
                    <textarea
                      value={formData.diachi}
                      onChange={(e) => handleInputChange('diachi', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Nhập địa chỉ trạm"
                      rows="2"
                    />
                  </div>

                  {/* Loại project */}
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      LOẠI PROJECT <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.loaiproject}
                      onChange={(e) => handleInputChange('loaiproject', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
                      required
                    >
                      <option value="btsmoi">BTS Mới</option>
                      <option value="kienco">Kiên Cố</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseFormModal}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  HỦY
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'ĐANG LƯU...' : (isEditMode ? 'CẬP NHẬT' : 'THÊM MỚI')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stations;

