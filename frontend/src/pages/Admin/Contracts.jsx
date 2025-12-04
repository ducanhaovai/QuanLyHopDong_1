import React, { useState, useEffect } from 'react';
import { FaFileContract, FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaFilter, FaTimes, FaDatabase } from 'react-icons/fa';
import { hopdongAPI, tramAPI, tinhAPI, cotAPI, volumeOtherAPI, hopdongCotAPI, hopdongVolumeOtherAPI } from '../../service/api';

const Contracts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [stations, setStations] = useState([]);
  const [tinhThanhList, setTinhThanhList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showAddStationModal, setShowAddStationModal] = useState(false);
  const [stationFormData, setStationFormData] = useState({
    matram: '',
    tinhthanh_id: '',
    diachi: '',
    loaiproject: 'btsmoi'
  });
  const [savingStation, setSavingStation] = useState(false);
  const [showVolumeModal, setShowVolumeModal] = useState(false);
  const [contractVolumes, setContractVolumes] = useState({ cot: [], volumeOther: [] });
  const [loadingVolumes, setLoadingVolumes] = useState(false);
  const [volumeTab, setVolumeTab] = useState('cot');
  const [availableCots, setAvailableCots] = useState([]);
  const [availableVolumes, setAvailableVolumes] = useState([]);
  const [pendingItems, setPendingItems] = useState([]); // Items đang chờ nhập số lượng
  const [formData, setFormData] = useState({
    tram_id: '',
    sohopdong: '',
    chudautu: '',
    ngayky: '',
    tonggiatri: '',
    trangthai: 'dangxuly'
  });

  // Load dữ liệu
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [contractsData, stationsData, tinhData] = await Promise.all([
        hopdongAPI.getAll(),
        tramAPI.getAll(),
        tinhAPI.getAll()
      ]);
      setContracts(contractsData);
      setStations(stationsData);
      setTinhThanhList(tinhData);
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadContractVolumes = async (contractId) => {
    try {
      setLoadingVolumes(true);
      const [cotData, volumeData] = await Promise.all([
        hopdongCotAPI.getAll(contractId),
        hopdongVolumeOtherAPI.getAll(contractId)
      ]);
      setContractVolumes({ cot: cotData, volumeOther: volumeData });
    } catch (error) {
      console.error('Lỗi tải volume hợp đồng:', error);
    } finally {
      setLoadingVolumes(false);
    }
  };

  const loadAvailableItems = async () => {
    try {
      const [cots, volumes] = await Promise.all([
        cotAPI.getAll(),
        volumeOtherAPI.getAll()
      ]);
      setAvailableCots(cots);
      setAvailableVolumes(volumes);
    } catch (error) {
      console.error('Lỗi tải danh sách:', error);
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'dangxuly': 'Đang xử lý',
      'hoanthanh': 'Hoàn thành',
      'tretien_do': 'Trễ tiến độ'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'dangxuly': 'bg-yellow-100 text-yellow-700',
      'hoanthanh': 'bg-green-100 text-green-700',
      'tretien_do': 'bg-red-100 text-red-700'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-700';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#10b981'; // green
    if (progress >= 50) return '#3b82f6'; // blue
    if (progress >= 30) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.sohopdong?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.chudautu?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.matram?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.tinhthanh_ten?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contract.trangthai === statusFilter;
    
    return matchesSearch && matchesStatus;
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
    loadContractVolumes(contract.id);
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setFormData({
      tram_id: '',
      sohopdong: '',
      chudautu: '',
      ngayky: '',
      tonggiatri: '',
      trangthai: 'dangxuly'
    });
    setError('');
    setShowFormModal(true);
  };

  const handleEdit = (contract) => {
    setIsEditMode(true);
    setSelectedContract(contract);
    setFormData({
      tram_id: contract.tram_id?.toString() || '',
      sohopdong: contract.sohopdong || '',
      chudautu: contract.chudautu || '',
      ngayky: contract.ngayky || '',
      tonggiatri: contract.tonggiatri?.toString() || '',
      trangthai: contract.trangthai || 'dangxuly'
    });
    setError('');
    setShowModal(false);
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hợp đồng này?')) {
      try {
        await hopdongAPI.delete(id);
        await loadData();
      } catch (error) {
        alert('Lỗi khi xóa hợp đồng: ' + (error.message || 'Lỗi server'));
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
    if (!formData.tram_id) {
      setError('Trạm là bắt buộc');
      return false;
    }
    if (!formData.sohopdong.trim()) {
      setError('Số hợp đồng là bắt buộc');
      return false;
    }
    if (!formData.chudautu.trim()) {
      setError('Chủ đầu tư là bắt buộc');
      return false;
    }
    if (!formData.ngayky) {
      setError('Ngày ký là bắt buộc');
      return false;
    }
    if (formData.tonggiatri && isNaN(parseFloat(formData.tonggiatri))) {
      setError('Tổng giá trị phải là số');
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
        tram_id: parseInt(formData.tram_id),
        sohopdong: formData.sohopdong.trim(),
        chudautu: formData.chudautu.trim(),
        ngayky: formData.ngayky,
        tonggiatri: formData.tonggiatri ? parseFloat(formData.tonggiatri) : 0
      };

      if (isEditMode) {
        submitData.trangthai = formData.trangthai;
        await hopdongAPI.update(selectedContract.id, submitData);
      } else {
        await hopdongAPI.create(submitData);
      }

      setShowFormModal(false);
      await loadData();
    } catch (error) {
      setError(error.message || 'Lỗi khi lưu hợp đồng');
    } finally {
      setSaving(false);
    }
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setFormData({
      tram_id: '',
      sohopdong: '',
      chudautu: '',
      ngayky: '',
      tonggiatri: '',
      trangthai: 'dangxuly'
    });
    setError('');
    setSelectedContract(null);
    setShowAddStationModal(false);
  };

  // Xử lý tạo trạm mới
  const handleAddStation = () => {
    setStationFormData({
      matram: '',
      tinhthanh_id: '',
      diachi: '',
      loaiproject: 'btsmoi'
    });
    setShowAddStationModal(true);
  };

  const handleStationInputChange = (field, value) => {
    setStationFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveStation = async (e) => {
    e.preventDefault();
    setSavingStation(true);
    try {
      const newStation = await tramAPI.create(stationFormData);
      setStations([...stations, newStation]);
      setFormData(prev => ({ ...prev, tram_id: newStation.id.toString() }));
      setShowAddStationModal(false);
    } catch (error) {
      alert('Lỗi khi tạo trạm: ' + (error.message || 'Lỗi server'));
    } finally {
      setSavingStation(false);
    }
  };

  // Xử lý volume
  const handleShowVolumeModal = async () => {
    if (selectedContract) {
      setVolumeTab('cot');
      setPendingItems([]);
      await loadContractVolumes(selectedContract.id);
      await loadAvailableItems();
      setShowVolumeModal(true);
    }
  };

  const handleSavePendingItem = async (pendingItem) => {
    if (!pendingItem.soluong || isNaN(parseInt(pendingItem.soluong)) || parseInt(pendingItem.soluong) <= 0) {
      alert('Vui lòng nhập số lượng hợp lệ');
      return;
    }
    try {
      if (pendingItem.type === 'cot') {
        await hopdongCotAPI.add(selectedContract.id, {
          cot_id: pendingItem.id,
          soluong: parseInt(pendingItem.soluong)
        });
      } else {
        await hopdongVolumeOtherAPI.add(selectedContract.id, {
          volume_id: pendingItem.id,
          soluong: parseInt(pendingItem.soluong)
        });
      }
      setPendingItems(prev => prev.filter(p => p.id !== pendingItem.id));
      await loadContractVolumes(selectedContract.id);
    } catch (error) {
      alert('Lỗi khi thêm: ' + (error.message || 'Lỗi server'));
    }
  };

  const handleDeleteCot = async (cotId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa cột này khỏi hợp đồng?')) {
      try {
        await hopdongCotAPI.delete(selectedContract.id, cotId);
        await loadContractVolumes(selectedContract.id);
      } catch (error) {
        alert('Lỗi khi xóa cột: ' + (error.message || 'Lỗi server'));
      }
    }
  };

  const handleDeleteVolumeOther = async (volumeId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa volume này khỏi hợp đồng?')) {
      try {
        await hopdongVolumeOtherAPI.delete(selectedContract.id, volumeId);
        await loadContractVolumes(selectedContract.id);
      } catch (error) {
        alert('Lỗi khi xóa volume: ' + (error.message || 'Lỗi server'));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">QUẢN LÝ HỢP ĐỒNG</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý và theo dõi các hợp đồng thi công</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm font-semibold"
        >
          <FaPlus className="w-4 h-4" />
          <span>THÊM HỢP ĐỒNG</span>
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
              placeholder="Tìm kiếm theo số hợp đồng, chủ đầu tư, mã trạm..."
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
              <option value="dangxuly">ĐANG XỬ LÝ</option>
              <option value="hoanthanh">HOÀN THÀNH</option>
              <option value="tretien_do">TRỄ TIẾN ĐỘ</option>
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
          <div className="text-sm text-gray-500 mb-1">ĐANG XỬ LÝ</div>
          <div className="text-2xl font-bold text-yellow-600">
            {contracts.filter(c => c.trangthai === 'dangxuly').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">HOÀN THÀNH</div>
          <div className="text-2xl font-bold text-green-600">
            {contracts.filter(c => c.trangthai === 'hoanthanh').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">TRỄ TIẾN ĐỘ</div>
          <div className="text-2xl font-bold text-red-600">
            {contracts.filter(c => c.trangthai === 'tretien_do').length}
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      ) : (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SỐ HỢP ĐỒNG</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">CHỦ ĐẦU TƯ</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">MÃ TRẠM</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">TỈNH/THÀNH</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">NGÀY KÝ</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">TỔNG GIÁ TRỊ</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">TRẠNG THÁI</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContracts.length === 0 ? (
                <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    Không tìm thấy hợp đồng nào
                  </td>
                </tr>
              ) : (
                  filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FaFileContract className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-800">{contract.sohopdong}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{contract.chudautu}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-800">{contract.matram}</span>
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{contract.tinhthanh_ten || 'Chưa xác định'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{formatDate(contract.ngayky)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-gray-800">{formatCurrency(contract.tonggiatri || 0)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.trangthai)}`}>
                        {getStatusLabel(contract.trangthai)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(contract)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleEdit(contract)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(contract.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Modal View Contract */}
      {showModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
                    <FaFileContract className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedContract.sohopdong}</h2>
                    <p className="text-sm text-gray-500 mt-1">Chi tiết hợp đồng</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Thông tin cơ bản */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-red-600"></div>
                    THÔNG TIN CƠ BẢN
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">SỐ HỢP ĐỒNG</label>
                      <p className="text-gray-800 font-semibold mt-1">{selectedContract.sohopdong}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">CHỦ ĐẦU TƯ</label>
                      <p className="text-gray-800 font-semibold mt-1">{selectedContract.chudautu}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">NGÀY KÝ</label>
                      <p className="text-gray-800 font-medium mt-1">{formatDate(selectedContract.ngayky)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">TRẠNG THÁI</label>
                      <p className="mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedContract.trangthai)}`}>
                          {getStatusLabel(selectedContract.trangthai)}
                        </span>
                      </p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase">TỔNG GIÁ TRỊ</label>
                      <p className="text-red-600 font-bold text-xl mt-1">{formatCurrency(selectedContract.tonggiatri || 0)}</p>
                    </div>
                  </div>
                </div>

                {/* Thông tin trạm */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-red-600"></div>
                    THÔNG TIN TRẠM
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">MÃ TRẠM</label>
                      <p className="text-gray-800 font-semibold mt-1">{selectedContract.matram || 'Chưa có'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">TỈNH/THÀNH</label>
                      <p className="text-gray-800 font-medium mt-1">
                        {selectedContract.tinhthanh_ten || 'Chưa xác định'}
                        {selectedContract.tinhthanh_ma && (
                          <span className="text-gray-500 ml-2">({selectedContract.tinhthanh_ma})</span>
                        )}
                      </p>
                    </div>
                    {selectedContract.tram_diachi && (
                      <div className="col-span-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase">ĐỊA CHỈ</label>
                        <p className="text-gray-800 mt-1">{selectedContract.tram_diachi}</p>
                      </div>
                    )}
                    {selectedContract.loaiproject && (
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">LOẠI PROJECT</label>
                        <p className="mt-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            selectedContract.loaiproject === 'btsmoi' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {selectedContract.loaiproject === 'btsmoi' ? 'BTS Mới' : 'Kiên Cố'}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tóm tắt Volume */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-red-600"></div>
                    TÓM TẮT VOLUME
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="text-xs font-semibold text-blue-600 uppercase mb-2">CỘT</div>
                      <div className="text-2xl font-bold text-blue-700">
                        {contractVolumes.cot.length}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        {contractVolumes.cot.reduce((sum, item) => sum + (item.soluong || 0), 0)} cột
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <div className="text-xs font-semibold text-purple-600 uppercase mb-2">VOLUME KHÁC</div>
                      <div className="text-2xl font-bold text-purple-700">
                        {contractVolumes.volumeOther.length}
                      </div>
                      <div className="text-xs text-purple-600 mt-1">
                        {contractVolumes.volumeOther.reduce((sum, item) => sum + (item.soluong || 0), 0)} volume
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <button
                onClick={handleShowVolumeModal}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
              >
                <FaDatabase className="w-4 h-4" />
                QUẢN LÝ VOLUME
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  ĐÓNG
                </button>
                <button 
                  onClick={() => {
                    setShowModal(false);
                    handleEdit(selectedContract);
                  }}
                  className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center gap-2"
                >
                  <FaEdit className="w-4 h-4" />
                  CHỈNH SỬA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form Add/Edit Contract */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FaFileContract className="w-6 h-6 text-gray-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {isEditMode ? 'CHỈNH SỬA HỢP ĐỒNG' : 'THÊM HỢP ĐỒNG MỚI'}
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
                  {/* Trạm */}
                  <div className="col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        TRẠM <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAddStation}
                        className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                      >
                        <FaPlus className="w-3 h-3" />
                        Thêm trạm mới
                      </button>
                    </div>
                    <select
                      value={formData.tram_id}
                      onChange={(e) => handleInputChange('tram_id', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
                      required
                    >
                      <option value="">Chọn trạm</option>
                      {stations.map(station => (
                        <option key={station.id} value={station.id.toString()}>
                          {station.matram} - {station.tinhthanh_ten || 'Chưa xác định'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Số hợp đồng */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      SỐ HỢP ĐỒNG <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.sohopdong}
                      onChange={(e) => handleInputChange('sohopdong', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="VD: HD-2025-001"
                      required
                    />
                  </div>

                  {/* Chủ đầu tư */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CHỦ ĐẦU TƯ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.chudautu}
                      onChange={(e) => handleInputChange('chudautu', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="VD: VTNet, Viettel..."
                      required
                    />
                  </div>

                  {/* Ngày ký */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      NGÀY KÝ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.ngayky}
                      onChange={(e) => handleInputChange('ngayky', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Tổng giá trị */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      TỔNG GIÁ TRỊ (VNĐ)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.tonggiatri}
                      onChange={(e) => handleInputChange('tonggiatri', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  {/* Trạng thái (chỉ khi sửa) */}
                  {isEditMode && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        TRẠNG THÁI
                      </label>
                      <select
                        value={formData.trangthai}
                        onChange={(e) => handleInputChange('trangthai', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
                      >
                        <option value="dangxuly">Đang xử lý</option>
                        <option value="hoanthanh">Hoàn thành</option>
                        <option value="tretien_do">Trễ tiến độ</option>
                      </select>
                    </div>
                  )}
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

      {/* Modal Thêm Trạm Mới */}
      {showAddStationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">THÊM TRẠM MỚI</h2>
                <button
                  onClick={() => setShowAddStationModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>
            <form onSubmit={handleSaveStation}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    MÃ TRẠM <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={stationFormData.matram}
                    onChange={(e) => handleStationInputChange('matram', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    TỈNH THÀNH <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={stationFormData.tinhthanh_id}
                    onChange={(e) => handleStationInputChange('tinhthanh_id', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ĐỊA CHỈ
                  </label>
                  <textarea
                    value={stationFormData.diachi}
                    onChange={(e) => handleStationInputChange('diachi', e.target.value)}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    LOẠI PROJECT <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={stationFormData.loaiproject}
                    onChange={(e) => handleStationInputChange('loaiproject', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
                    required
                  >
                    <option value="btsmoi">BTS Mới</option>
                    <option value="kienco">Kiên Cố</option>
                  </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddStationModal(false)}
                  disabled={savingStation}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  HỦY
                </button>
                <button
                  type="submit"
                  disabled={savingStation}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50"
                >
                  {savingStation ? 'ĐANG LƯU...' : 'THÊM TRẠM'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Quản Lý Volume - Drag and Drop */}
      {showVolumeModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">QUẢN LÝ VOLUME - {selectedContract.sohopdong}</h2>
                <button
                  onClick={() => setShowVolumeModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden flex">
              {/* Tab Navigation */}
              <div className="w-48 border-r border-gray-200 bg-gray-50 p-4">
                <button
                  onClick={() => setVolumeTab('cot')}
                  className={`w-full text-left px-4 py-3 rounded-lg mb-2 font-semibold transition-colors ${
                    volumeTab === 'cot' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  CỘT
                </button>
                <button
                  onClick={() => setVolumeTab('volume')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
                    volumeTab === 'volume' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  VOLUME KHÁC
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left: Available Items */}
                <div className="w-1/2 border-r border-gray-200 p-4 overflow-y-auto">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {volumeTab === 'cot' ? 'DANH SÁCH CỘT' : 'DANH SÁCH VOLUME'}
                  </h3>
                  {loadingVolumes ? (
                    <div className="text-center py-8 text-gray-500">Đang tải...</div>
                  ) : (
                    <div className="space-y-2">
                      {(volumeTab === 'cot' ? availableCots : availableVolumes)
                        .filter(item => {
                          const assignedIds = volumeTab === 'cot' 
                            ? contractVolumes.cot.map(c => c.cot_id || c.id).filter(Boolean)
                            : contractVolumes.volumeOther.map(v => v.volume_id || v.id).filter(Boolean);
                          const pendingIds = pendingItems.map(p => p.id).filter(Boolean);
                          return !assignedIds.includes(item.id) && !pendingIds.includes(item.id);
                        })
                        .map((item) => (
                          <div
                            key={item.id}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/json', JSON.stringify({
                                type: volumeTab,
                                id: item.id,
                                data: item
                              }));
                            }}
                            className="bg-white border border-gray-200 rounded-lg p-3 cursor-move hover:border-red-500 hover:shadow-md transition-all"
                          >
                            <div className="font-medium text-gray-800">
                              {item.tencot || item.tenvolume}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Right: Assigned Items */}
                <div 
                  className="w-1/2 p-4 overflow-y-auto"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('bg-blue-50');
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('bg-blue-50');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('bg-blue-50');
                    try {
                      const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
                      // Thêm vào danh sách pending với input số lượng
                      setPendingItems(prev => [...prev, {
                        id: dragData.id,
                        type: dragData.type,
                        name: dragData.data.tencot || dragData.data.tenvolume,
                        soluong: '1'
                      }]);
                    } catch (error) {
                      console.error('Lỗi khi kéo thả:', error);
                    }
                  }}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {volumeTab === 'cot' ? 'CỘT ĐÃ GÁN' : 'VOLUME ĐÃ GÁN'}
                  </h3>
                  {loadingVolumes ? (
                    <div className="text-center py-8 text-gray-500">Đang tải...</div>
                  ) : (
                    <div className="space-y-2">
                      {/* Pending Items - đang chờ nhập số lượng */}
                      {pendingItems
                        .filter(p => p.type === volumeTab)
                        .map((pendingItem) => (
                          <div
                            key={`pending-${pendingItem.id}`}
                            className="bg-blue-50 border-2 border-blue-300 border-dashed rounded-lg p-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex-1 font-medium text-gray-800">
                                {pendingItem.name}
                              </div>
                              <input
                                type="number"
                                min="1"
                                value={pendingItem.soluong}
                                onChange={(e) => {
                                  setPendingItems(prev => prev.map(p => 
                                    p.id === pendingItem.id ? { ...p, soluong: e.target.value } : p
                                  ));
                                }}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                                onKeyPress={async (e) => {
                                  if (e.key === 'Enter') {
                                    await handleSavePendingItem(pendingItem);
                                  }
                                }}
                              />
                              <button
                                onClick={() => handleSavePendingItem(pendingItem)}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-semibold"
                              >
                                Thêm
                              </button>
                              <button
                                onClick={() => {
                                  setPendingItems(prev => prev.filter(p => p.id !== pendingItem.id));
                                }}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <FaTimes className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}

                      {/* Assigned Items - đã thêm vào hợp đồng */}
                      {(volumeTab === 'cot' ? contractVolumes.cot : contractVolumes.volumeOther).length === 0 && 
                       pendingItems.filter(p => p.type === volumeTab).length === 0 ? (
                        <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                          Kéo thả {volumeTab === 'cot' ? 'cột' : 'volume'} từ bên trái vào đây
                        </div>
                      ) : (
                        (volumeTab === 'cot' ? contractVolumes.cot : contractVolumes.volumeOther).map((item) => {
                          const itemId = volumeTab === 'cot' ? (item.cot_id || item.id) : (item.volume_id || item.id);
                          const tencot = volumeTab === 'cot' ? (item.tencot || item.cot_tencot) : (item.tenvolume || item.volume_tenvolume);
                          return (
                            <div
                              key={item.id}
                              className="bg-white border border-gray-200 rounded-lg p-3 hover:border-red-500 transition-all"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="font-medium text-gray-800 flex-1">
                                    {tencot}
                                  </div>
                                  <input
                                    type="number"
                                    min="1"
                                    value={item.soluong}
                                    onChange={async (e) => {
                                      const newSoluong = parseInt(e.target.value);
                                      if (newSoluong > 0) {
                                        try {
                                          if (volumeTab === 'cot') {
                                            await hopdongCotAPI.update(selectedContract.id, itemId, { soluong: newSoluong });
                                          } else {
                                            await hopdongVolumeOtherAPI.update(selectedContract.id, itemId, { soluong: newSoluong });
                                          }
                                          await loadContractVolumes(selectedContract.id);
                                        } catch (error) {
                                          alert('Lỗi khi cập nhật: ' + (error.message || 'Lỗi server'));
                                        }
                                      }
                                    }}
                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                                  />
                                  {item.tongtien > 0 && (
                                    <span className="text-sm text-red-600 font-medium">
                                      {formatCurrency(item.tongtien)}
                                    </span>
                                  )}
                                </div>
                                <button
                                  onClick={() => {
                                    if (volumeTab === 'cot') {
                                      handleDeleteCot(itemId);
                                    } else {
                                      handleDeleteVolumeOther(itemId);
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-700 p-1 ml-2"
                                  title="Xóa"
                                >
                                  <FaTrash className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowVolumeModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ĐÓNG
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Contracts;
