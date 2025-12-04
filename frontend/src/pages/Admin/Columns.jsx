import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaMapMarkerAlt, FaDatabase } from 'react-icons/fa';
import { cotAPI } from '../../service/api';

const Columns = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    macot: '',
    tencot: '',
    vitri: 'Dưới đất',
    cao: '',
    giadonvi: '',
    mota: ''
  });

  // Load dữ liệu
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await cotAPI.getAll();
      setColumns(data);
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLocationColor = (location) => {
    const colorMap = {
      'Dưới đất': 'bg-blue-100 text-blue-700',
      'Trên mái': 'bg-purple-100 text-purple-700'
    };
    return colorMap[location] || 'bg-gray-100 text-gray-700';
  };

  const filteredColumns = columns.filter(column => {
    const matchesSearch = 
      column.macot?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      column.tencot?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = locationFilter === 'all' || column.vitri === locationFilter;
    
    return matchesSearch && matchesLocation;
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const handleView = (column) => {
    setSelectedColumn(column);
    setShowModal(true);
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setFormData({
      macot: '',
      tencot: '',
      vitri: 'Dưới đất',
      cao: '',
      giadonvi: '',
      mota: ''
    });
    setError('');
    setShowFormModal(true);
  };

  const handleEdit = (column) => {
    setIsEditMode(true);
    setSelectedColumn(column);
    setFormData({
      macot: column.macot || '',
      tencot: column.tencot || '',
      vitri: column.vitri || 'Dưới đất',
      cao: column.cao?.toString() || '',
      giadonvi: column.giadonvi?.toString() || '',
      mota: column.mota || ''
    });
    setError('');
    setShowModal(false);
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa loại cột này?')) {
      try {
        await cotAPI.delete(id);
        await loadData();
      } catch (error) {
        alert('Lỗi khi xóa cột: ' + (error.message || 'Lỗi server'));
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
    if (!formData.macot.trim()) {
      setError('Mã cột là bắt buộc');
      return false;
    }
    if (!formData.tencot.trim()) {
      setError('Tên cột là bắt buộc');
      return false;
    }
    if (formData.cao && isNaN(parseFloat(formData.cao))) {
      setError('Chiều cao phải là số');
      return false;
    }
    if (formData.giadonvi && isNaN(parseFloat(formData.giadonvi))) {
      setError('Giá đơn vị phải là số');
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
        macot: formData.macot.trim(),
        tencot: formData.tencot.trim(),
        vitri: formData.vitri || null,
        cao: formData.cao ? parseFloat(formData.cao) : null,
        giadonvi: formData.giadonvi ? parseFloat(formData.giadonvi) : 0,
        mota: formData.mota.trim() || null
      };

      if (isEditMode) {
        await cotAPI.update(selectedColumn.id, submitData);
      } else {
        await cotAPI.create(submitData);
      }

      setShowFormModal(false);
      await loadData();
    } catch (error) {
      setError(error.message || 'Lỗi khi lưu cột');
    } finally {
      setSaving(false);
    }
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setFormData({
      macot: '',
      tencot: '',
      vitri: 'Dưới đất',
      cao: '',
      giadonvi: '',
      mota: ''
    });
    setError('');
    setSelectedColumn(null);
  };

  const uniqueLocations = [...new Set(columns.map(c => c.vitri).filter(Boolean))].sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">THƯ VIỆN CỘT</h1>
          <p className="text-sm text-gray-500 mt-1">Danh sách các loại cột có sẵn trong hệ thống</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors shadow-sm font-semibold"
        >
          <FaPlus className="w-4 h-4" />
          <span>THÊM LOẠI CỘT</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã cột, tên loại cột..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Location Filter */}
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">TẤT CẢ VỊ TRÍ</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">TỔNG SỐ LOẠI CỘT</div>
          <div className="text-2xl font-bold text-gray-800">{columns.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">DƯỚI ĐẤT</div>
          <div className="text-2xl font-bold text-blue-600">
            {columns.filter(c => c.location === 'Dưới đất').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">TRÊN MÁI</div>
          <div className="text-2xl font-bold text-purple-600">
            {columns.filter(c => c.location === 'Trên mái').length}
          </div>
        </div>
      </div>

      {/* Columns Cards */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      ) : filteredColumns.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <FaDatabase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Không tìm thấy loại cột nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColumns.map((column) => (
            <div
              key={column.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FaDatabase className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{column.macot}</h3>
                    <p className="text-sm text-gray-500">{column.tencot}</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="space-y-3 mb-4">
                {column.cao && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Chiều cao:</span>
                    <span className="font-semibold text-gray-800">{column.cao}m</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Vị trí:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLocationColor(column.vitri)}`}>
                    {column.vitri || 'Chưa xác định'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Giá:</span>
                  <span className="font-bold text-red-600 text-lg">{formatCurrency(column.giadonvi || 0)}</span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleView(column)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  <FaEye className="w-4 h-4" />
                  <span>Xem</span>
                </button>
                <button
                  onClick={() => handleEdit(column)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium"
                  title="Chỉnh sửa"
                >
                  <FaEdit className="w-4 h-4" />
                  <span>Sửa</span>
                </button>
                <button
                  onClick={() => handleDelete(column.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  title="Xóa"
                >
                  <FaTrash className="w-4 h-4" />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal View Column */}
      {showModal && selectedColumn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FaDatabase className="w-6 h-6 text-gray-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">CHI TIẾT LOẠI CỘT</h2>
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
                  <label className="text-sm font-semibold text-gray-500">MÃ CỘT</label>
                  <p className="text-gray-800 font-medium mt-1">{selectedColumn.macot}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500">TÊN LOẠI CỘT</label>
                  <p className="text-gray-800 font-medium mt-1">{selectedColumn.tencot}</p>
                </div>
                {selectedColumn.cao && (
                  <div>
                    <label className="text-sm font-semibold text-gray-500">CHIỀU CAO</label>
                    <p className="text-gray-800 font-medium mt-1">{selectedColumn.cao}m</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-gray-500">VỊ TRÍ LẮP ĐẶT</label>
                  <p className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLocationColor(selectedColumn.vitri)}`}>
                      {selectedColumn.vitri || 'Chưa xác định'}
                    </span>
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-500">GIÁ ĐƠN VỊ (VNĐ)</label>
                  <p className="text-gray-800 font-semibold text-lg mt-1">{formatCurrency(selectedColumn.giadonvi || 0)}</p>
                </div>
                {selectedColumn.mota && (
                  <div className="col-span-2">
                    <label className="text-sm font-semibold text-gray-500">MÔ TẢ</label>
                    <p className="text-gray-800 mt-1">{selectedColumn.mota}</p>
                  </div>
                )}
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
                  handleEdit(selectedColumn);
                }}
                className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                CHỈNH SỬA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form Add/Edit Column */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FaDatabase className="w-6 h-6 text-gray-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {isEditMode ? 'CHỈNH SỬA LOẠI CỘT' : 'THÊM LOẠI CỘT MỚI'}
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
                  {/* Mã cột */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      MÃ CỘT <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.macot}
                      onChange={(e) => handleInputChange('macot', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="VD: COT-001"
                      required
                    />
                  </div>

                  {/* Tên cột */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      TÊN LOẠI CỘT <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.tencot}
                      onChange={(e) => handleInputChange('tencot', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="VD: Monopole H=30m"
                      required
                    />
                  </div>

                  {/* Vị trí */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      VỊ TRÍ LẮP ĐẶT
                    </label>
                    <select
                      value={formData.vitri}
                      onChange={(e) => handleInputChange('vitri', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="Dưới đất">Dưới đất</option>
                      <option value="Trên mái">Trên mái</option>
                    </select>
                  </div>

                  {/* Chiều cao */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CHIỀU CAO (m)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.cao}
                      onChange={(e) => handleInputChange('cao', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="VD: 30"
                      min="0"
                    />
                  </div>

                  {/* Giá đơn vị */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      GIÁ ĐƠN VỊ (VNĐ)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.giadonvi}
                      onChange={(e) => handleInputChange('giadonvi', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  {/* Mô tả */}
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      MÔ TẢ
                    </label>
                    <textarea
                      value={formData.mota}
                      onChange={(e) => handleInputChange('mota', e.target.value)}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Mô tả về loại cột..."
                    ></textarea>
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

export default Columns;

