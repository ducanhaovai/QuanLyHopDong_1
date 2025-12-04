import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaDatabase } from 'react-icons/fa';
import { volumeOtherAPI } from '../../service/api';

const VolumeOther = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedVolume, setSelectedVolume] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [volumes, setVolumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    mavolume: '',
    tenvolume: '',
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
      const data = await volumeOtherAPI.getAll();
      setVolumes(data);
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVolumes = volumes.filter(volume => {
    const matchesSearch = 
      volume.mavolume?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volume.tenvolume?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const handleView = (volume) => {
    setSelectedVolume(volume);
    setShowModal(true);
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setFormData({
      mavolume: '',
      tenvolume: '',
      giadonvi: '',
      mota: ''
    });
    setError('');
    setShowFormModal(true);
  };

  const handleEdit = (volume) => {
    setIsEditMode(true);
    setSelectedVolume(volume);
    setFormData({
      mavolume: volume.mavolume || '',
      tenvolume: volume.tenvolume || '',
      giadonvi: volume.giadonvi?.toString() || '',
      mota: volume.mota || ''
    });
    setError('');
    setShowModal(false);
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa volume này?')) {
      try {
        await volumeOtherAPI.delete(id);
        await loadData();
      } catch (error) {
        alert('Lỗi khi xóa volume: ' + (error.message || 'Lỗi server'));
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
    if (!formData.mavolume.trim()) {
      setError('Mã volume là bắt buộc');
      return false;
    }
    if (!formData.tenvolume.trim()) {
      setError('Tên volume là bắt buộc');
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
        mavolume: formData.mavolume.trim(),
        tenvolume: formData.tenvolume.trim(),
        giadonvi: formData.giadonvi ? parseFloat(formData.giadonvi) : 0,
        mota: formData.mota.trim() || null
      };

      if (isEditMode) {
        await volumeOtherAPI.update(selectedVolume.id, submitData);
      } else {
        await volumeOtherAPI.create(submitData);
      }

      setShowFormModal(false);
      await loadData();
    } catch (error) {
      setError(error.message || 'Lỗi khi lưu volume');
    } finally {
      setSaving(false);
    }
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setFormData({
      mavolume: '',
      tenvolume: '',
      giadonvi: '',
      mota: ''
    });
    setError('');
    setSelectedVolume(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">THƯ VIỆN VOLUME KHÁC</h1>
          <p className="text-sm text-gray-500 mt-1">Danh sách các volume khác có sẵn trong hệ thống</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors shadow-sm font-semibold"
        >
          <FaPlus className="w-4 h-4" />
          <span>THÊM VOLUME</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã volume, tên volume..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">TỔNG SỐ VOLUME</div>
          <div className="text-2xl font-bold text-gray-800">{volumes.length}</div>
        </div>
      </div>

      {/* Volumes Cards */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      ) : filteredVolumes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <FaDatabase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Không tìm thấy volume nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVolumes.map((volume) => (
            <div
              key={volume.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FaDatabase className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{volume.mavolume}</h3>
                    <p className="text-sm text-gray-500">{volume.tenvolume}</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="space-y-3 mb-4">
                {volume.mota && (
                  <div className="text-sm text-gray-600 line-clamp-2">{volume.mota}</div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Giá:</span>
                  <span className="font-bold text-red-600 text-lg">{formatCurrency(volume.giadonvi || 0)}</span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleView(volume)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  <FaEye className="w-4 h-4" />
                  <span>Xem</span>
                </button>
                <button
                  onClick={() => handleEdit(volume)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium"
                  title="Chỉnh sửa"
                >
                  <FaEdit className="w-4 h-4" />
                  <span>Sửa</span>
                </button>
                <button
                  onClick={() => handleDelete(volume.id)}
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

      {/* Modal View Volume */}
      {showModal && selectedVolume && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FaDatabase className="w-6 h-6 text-gray-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">CHI TIẾT VOLUME</h2>
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
                  <label className="text-sm font-semibold text-gray-500">MÃ VOLUME</label>
                  <p className="text-gray-800 font-medium mt-1">{selectedVolume.mavolume}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500">TÊN VOLUME</label>
                  <p className="text-gray-800 font-medium mt-1">{selectedVolume.tenvolume}</p>
                </div>
                {selectedVolume.mota && (
                  <div className="col-span-2">
                    <label className="text-sm font-semibold text-gray-500">MÔ TẢ</label>
                    <p className="text-gray-800 mt-1">{selectedVolume.mota}</p>
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
                  handleEdit(selectedVolume);
                }}
                className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                CHỈNH SỬA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form Add/Edit Volume */}
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
                    {isEditMode ? 'CHỈNH SỬA VOLUME' : 'THÊM VOLUME MỚI'}
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
                  {/* Mã volume */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      MÃ VOLUME <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.mavolume}
                      onChange={(e) => handleInputChange('mavolume', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="VD: VOL-001"
                      required
                    />
                  </div>

                  {/* Tên volume */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      TÊN VOLUME <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.tenvolume}
                      onChange={(e) => handleInputChange('tenvolume', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="VD: Phòng máy cải tạo trên mái"
                      required
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
                      placeholder="Mô tả về volume..."
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

export default VolumeOther;

