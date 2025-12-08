import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaSave, FaSpinner, FaCheckCircle, FaTimes } from 'react-icons/fa';

// Component row để quản lý state riêng cho mỗi input
const KSTKRow = ({ item, type, onSave, saving }) => {
  const [soluongThucte, setSoluongThucte] = useState(item.soluong_thucte || 0);

  useEffect(() => {
    setSoluongThucte(item.soluong_thucte || 0);
  }, [item.soluong_thucte]);

  const chenhlech = soluongThucte - item.soluong;
  const phantramChenhlech = item.soluong > 0 ? ((chenhlech / item.soluong) * 100).toFixed(1) : '0';

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <span className="font-semibold">{type === 'cot' ? item.macot : item.mavolume}</span>
        <br />
        <span className="text-sm text-gray-500">{type === 'cot' ? item.tencot : item.tenvolume}</span>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="font-semibold">{item.soluong}</span>
      </td>
      <td className="px-4 py-3 text-center">
        <input
          type="number"
          min="0"
          value={soluongThucte}
          onChange={(e) => setSoluongThucte(parseInt(e.target.value) || 0)}
          className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
        />
      </td>
      <td className="px-4 py-3 text-center">
        <span className={`font-semibold ${
          chenhlech < 0 ? 'text-red-600' : 
          chenhlech > 0 ? 'text-blue-600' : 'text-green-600'
        }`}>
          {chenhlech > 0 ? '+' : ''}{chenhlech}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="text-sm">{phantramChenhlech}%</span>
      </td>
      <td className="px-4 py-3 text-center">
        <button
          onClick={() => onSave(type, type === 'cot' ? item.cot_id : item.volume_id, soluongThucte)}
          disabled={saving}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm flex items-center gap-1"
        >
          {saving ? <FaSpinner className="animate-spin w-3 h-3" /> : 'LƯU'}
        </button>
      </td>
    </tr>
  );
};
import { 
  hopdongAPI, 
  hopdongCotAPI, 
  hopdongVolumeOtherAPI, 
  thucteCotAPI, 
  thucteVolumeOtherAPI,
  cotAPI,
  volumeOtherAPI
} from '../../service/api.js';

const KTVSurveyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [contractCots, setContractCots] = useState([]);
  const [contractVolumes, setContractVolumes] = useState([]);
  const [kstkCots, setKstkCots] = useState([]);
  const [kstkVolumes, setKstkVolumes] = useState([]);
  const [availableCots, setAvailableCots] = useState([]);
  const [availableVolumes, setAvailableVolumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('cot'); // 'cot' or 'volume'
  const [showAddCotModal, setShowAddCotModal] = useState(false);
  const [showAddVolumeModal, setShowAddVolumeModal] = useState(false);
  const [newCotForm, setNewCotForm] = useState({
    macot: '',
    tencot: '',
    vitri: '',
    cao: '',
    giadonvi: '0',
    mota: ''
  });
  const [newVolumeForm, setNewVolumeForm] = useState({
    mavolume: '',
    tenvolume: '',
    giadonvi: '0',
    mota: ''
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [contractData, cotsData, volumesData, kstkCotsData, kstkVolumesData, allCots, allVolumes] = await Promise.all([
        hopdongAPI.getById(id),
        hopdongCotAPI.getAll(id),
        hopdongVolumeOtherAPI.getAll(id),
        thucteCotAPI.getAll(id),
        thucteVolumeOtherAPI.getAll(id),
        cotAPI.getAll(),
        volumeOtherAPI.getAll()
      ]);
      
      setContract(contractData);
      setContractCots(cotsData);
      setContractVolumes(volumesData);
      setKstkCots(kstkCotsData);
      setKstkVolumes(kstkVolumesData);
      setAvailableCots(allCots);
      setAvailableVolumes(allVolumes);
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
      alert('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKSTK = async (type, itemId, soluongThucte) => {
    try {
      setSaving(true);
      if (type === 'cot') {
        // Kiểm tra đã có bản ghi chưa
        const existing = kstkCots.find(k => k.cot_id === itemId);
        if (existing) {
          await thucteCotAPI.update(id, itemId, { soluong_thucte: soluongThucte });
        } else {
          await thucteCotAPI.create(id, { cot_id: itemId, soluong_thucte: soluongThucte });
        }
      } else {
        const existing = kstkVolumes.find(k => k.volume_id === itemId);
        if (existing) {
          await thucteVolumeOtherAPI.update(id, itemId, { soluong_thucte: soluongThucte });
        } else {
          await thucteVolumeOtherAPI.create(id, { volume_id: itemId, soluong_thucte: soluongThucte });
        }
      }
      await loadData();
      alert('Lưu thành công!');
    } catch (error) {
      console.error('Lỗi lưu KSTK:', error);
      alert('Không thể lưu dữ liệu');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateNewCot = async () => {
    try {
      setSaving(true);
      // Tạo cột mới trong thư viện
      const newCot = await cotAPI.create(newCotForm);
      
      // Kiểm tra xem cột mới đã có trong hợp đồng chưa
      const existsInContract = contractCots.find(c => c.cot_id === newCot.id);
      if (!existsInContract) {
        // Tự động thêm vào hợp đồng với số lượng = 0
        await hopdongCotAPI.add(id, { cot_id: newCot.id, soluong: 0 });
      }
      
      await loadData();
      setShowAddCotModal(false);
      setNewCotForm({ macot: '', tencot: '', vitri: '', cao: '', giadonvi: '0', mota: '' });
      alert('Tạo cột mới thành công và đã thêm vào hợp đồng!');
    } catch (error) {
      console.error('Lỗi tạo cột:', error);
      alert('Không thể tạo cột mới');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateNewVolume = async () => {
    try {
      setSaving(true);
      // Tạo volume mới trong thư viện
      const newVolume = await volumeOtherAPI.create(newVolumeForm);
      
      // Kiểm tra xem volume mới đã có trong hợp đồng chưa
      const existsInContract = contractVolumes.find(v => v.volume_id === newVolume.id);
      if (!existsInContract) {
        // Tự động thêm vào hợp đồng với số lượng = 0
        await hopdongVolumeOtherAPI.add(id, { volume_id: newVolume.id, soluong: 0 });
      }
      
      await loadData();
      setShowAddVolumeModal(false);
      setNewVolumeForm({ mavolume: '', tenvolume: '', giadonvi: '0', mota: '' });
      alert('Tạo volume mới thành công và đã thêm vào hợp đồng!');
    } catch (error) {
      console.error('Lỗi tạo volume:', error);
      alert('Không thể tạo volume mới');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="w-8 h-8 text-gray-400 animate-spin mr-3" />
        <span className="text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không tìm thấy hợp đồng</p>
        <button onClick={() => navigate('/hopdong-can-khaosat')} className="mt-4 text-red-600 hover:underline">
          Quay lại danh sách
        </button>
      </div>
    );
  }

  // Merge dữ liệu hợp đồng với KSTK
  const mergedCots = contractCots.map(cot => {
    const kstk = kstkCots.find(k => k.cot_id === cot.cot_id);
    return {
      ...cot,
      soluong_thucte: kstk?.soluong_thucte || 0,
      chenhlech: kstk ? kstk.chenhlech : -cot.soluong,
      phantram_chenhlech: kstk?.phantram_chenhlech || 0,
      hasKSTK: !!kstk
    };
  });

  const mergedVolumes = contractVolumes.map(vol => {
    const kstk = kstkVolumes.find(k => k.volume_id === vol.volume_id);
    return {
      ...vol,
      soluong_thucte: kstk?.soluong_thucte || 0,
      chenhlech: kstk ? kstk.chenhlech : -vol.soluong,
      phantram_chenhlech: kstk?.phantram_chenhlech || 0,
      hasKSTK: !!kstk
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/hopdong-can-khaosat')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">KHẢO SÁT HỢP ĐỒNG</h1>
            <p className="text-sm text-gray-500 mt-1">
              {contract.sohopdong} - {contract.matram || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Contract Info */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-gray-500">Tỉnh/Thành</label>
            <p className="font-semibold">{contract.tinhthanh_ten || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Chủ đầu tư</label>
            <p className="font-semibold">{contract.chudautu}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Ngày ký</label>
            <p className="font-semibold">{new Date(contract.ngayky).toLocaleDateString('vi-VN')}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Giá trị</label>
            <p className="font-semibold">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(contract.tonggiatri || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('cot')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'cot'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              CỘT ({mergedCots.length})
            </button>
            <button
              onClick={() => setActiveTab('volume')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'volume'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              VOLUME KHÁC ({mergedVolumes.length})
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Add New Button */}
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => activeTab === 'cot' ? setShowAddCotModal(true) : setShowAddVolumeModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FaPlus className="w-4 h-4" />
              <span>TẠO {activeTab === 'cot' ? 'CỘT' : 'VOLUME'} MỚI</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tên</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Số lượng HĐ</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Số lượng thực tế</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Chênh lệch</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">% Chênh lệch</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(activeTab === 'cot' ? mergedCots : mergedVolumes).map((item) => (
                  <KSTKRow
                    key={item.id || (activeTab === 'cot' ? item.cot_id : item.volume_id)}
                    item={item}
                    type={activeTab}
                    onSave={handleSaveKSTK}
                    saving={saving}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Cot Modal */}
      {showAddCotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Tạo cột mới</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Mã cột *</label>
                <input
                  type="text"
                  value={newCotForm.macot}
                  onChange={(e) => setNewCotForm({...newCotForm, macot: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Tên cột *</label>
                <input
                  type="text"
                  value={newCotForm.tencot}
                  onChange={(e) => setNewCotForm({...newCotForm, tencot: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Vị trí lắp đặt</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Dưới đất, Trên mái"
                  value={newCotForm.vitri}
                  onChange={(e) => setNewCotForm({...newCotForm, vitri: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Chiều cao (m)</label>
                <input
                  type="number"
                  value={newCotForm.cao}
                  onChange={(e) => setNewCotForm({...newCotForm, cao: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Giá đơn vị</label>
                <input
                  type="number"
                  value={newCotForm.giadonvi}
                  onChange={(e) => setNewCotForm({...newCotForm, giadonvi: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Mô tả</label>
                <textarea
                  value={newCotForm.mota}
                  onChange={(e) => setNewCotForm({...newCotForm, mota: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="3"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddCotModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                HỦY
              </button>
              <button
                onClick={handleCreateNewCot}
                disabled={saving || !newCotForm.macot || !newCotForm.tencot}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {saving ? <FaSpinner className="animate-spin mx-auto" /> : 'TẠO MỚI'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Volume Modal */}
      {showAddVolumeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Tạo volume mới</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Mã volume *</label>
                <input
                  type="text"
                  value={newVolumeForm.mavolume}
                  onChange={(e) => setNewVolumeForm({...newVolumeForm, mavolume: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Tên volume *</label>
                <input
                  type="text"
                  value={newVolumeForm.tenvolume}
                  onChange={(e) => setNewVolumeForm({...newVolumeForm, tenvolume: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Giá đơn vị</label>
                <input
                  type="number"
                  value={newVolumeForm.giadonvi}
                  onChange={(e) => setNewVolumeForm({...newVolumeForm, giadonvi: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Mô tả</label>
                <textarea
                  value={newVolumeForm.mota}
                  onChange={(e) => setNewVolumeForm({...newVolumeForm, mota: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="3"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddVolumeModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                HỦY
              </button>
              <button
                onClick={handleCreateNewVolume}
                disabled={saving || !newVolumeForm.mavolume || !newVolumeForm.tenvolume}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {saving ? <FaSpinner className="animate-spin mx-auto" /> : 'TẠO MỚI'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KTVSurveyDetail;

