import React, { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';

const DashboardFilters = () => {
  const [linhVuc, setLinhVuc] = useState('Tất cả');
  const [loaiBieuDo, setLoaiBieuDo] = useState('Tháng');
  const [thang, setThang] = useState('Tháng 9');
  const [nam, setNam] = useState('Năm 2024');
  const [ngayBatDau, setNgayBatDau] = useState('');
  const [ngayKetThuc, setNgayKetThuc] = useState('');

  const linhVucOptions = ['Tất cả', 'BTS Mới', 'Kiên Cố', 'Nâng cấp'];
  const loaiBieuDoOptions = ['Tháng', 'Quý', 'Năm'];
  const thangOptions = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
  const namOptions = ['Năm 2024', 'Năm 2023', 'Năm 2022', 'Năm 2021'];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Lĩnh Vực */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">LĨNH VỰC</label>
          <div className="relative">
            <select
              value={linhVuc}
              onChange={(e) => setLinhVuc(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent cursor-pointer"
            >
              {linhVucOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <HiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Loại Biểu Đồ */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">LOẠI BIỂU ĐỒ</label>
          <div className="relative">
            <select
              value={loaiBieuDo}
              onChange={(e) => setLoaiBieuDo(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent cursor-pointer"
            >
              {loaiBieuDoOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <HiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Tháng */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">THÁNG</label>
          <div className="relative">
            <select
              value={thang}
              onChange={(e) => setThang(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent cursor-pointer"
            >
              {thangOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <HiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Năm */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">NĂM</label>
          <div className="relative">
            <select
              value={nam}
              onChange={(e) => setNam(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent cursor-pointer"
            >
              {namOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <HiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Ngày Bắt Đầu */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">NGÀY BẮT ĐẦU</label>
          <div className="relative">
            <input
              type="date"
              value={ngayBatDau}
              onChange={(e) => setNgayBatDau(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
            />
          </div>
        </div>

        {/* Ngày Kết Thúc */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">NGÀY KẾT THÚC</label>
          <div className="relative">
            <input
              type="date"
              value={ngayKetThuc}
              onChange={(e) => setNgayKetThuc(e.target.value)}
              min={ngayBatDau}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters;

