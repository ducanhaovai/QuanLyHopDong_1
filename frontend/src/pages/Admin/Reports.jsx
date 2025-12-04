import React, { useState } from 'react';
import { FaChartBar, FaFileExcel, FaDownload, FaFileContract, FaTasks, FaDollarSign, FaBalanceScale, FaChartLine, FaMapMarkerAlt, FaSearch, FaCalendarAlt } from 'react-icons/fa';

const Reports = () => {
  const [reportSearchTerm, setReportSearchTerm] = useState('');
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const reportTypes = [
    { 
      id: 1,
      title: 'Báo cáo danh sách HĐ', 
      desc: 'Xuất danh sách hợp đồng theo bộ lọc', 
      icon: FaFileContract,
      color: 'bg-blue-500'
    },
    { 
      id: 2,
      title: 'Báo cáo tiến độ', 
      desc: 'Tiến trình chi tiết từng hợp đồng', 
      icon: FaTasks,
      color: 'bg-yellow-500'
    },
    { 
      id: 3,
      title: 'Báo cáo doanh thu', 
      desc: 'Thống kê doanh thu theo thời gian', 
      icon: FaDollarSign,
      color: 'bg-green-500'
    },
    { 
      id: 4,
      title: 'Báo cáo so sánh', 
      desc: 'Volume HĐ vs Thực tế KSTK', 
      icon: FaBalanceScale,
      color: 'bg-purple-500'
    },
    { 
      id: 5,
      title: 'Báo cáo tổng hợp', 
      desc: 'Gộp dữ liệu từ nhiều module', 
      icon: FaChartLine,
      color: 'bg-indigo-500'
    },
    { 
      id: 6,
      title: 'Báo cáo theo tỉnh', 
      desc: 'Thống kê chi tiết từng tỉnh', 
      icon: FaMapMarkerAlt,
      color: 'bg-red-500'
    },
  ];

  const exportHistory = [
    { id: 1, file: 'Bao_cao_danh_sach_HD_2025.xlsx', date: '2025-11-12 14:30', user: 'Admin', size: '2.4 MB' },
    { id: 2, file: 'Bao_cao_tien_do_Q4_2024.xlsx', date: '2025-11-10 10:15', user: 'Manager', size: '1.8 MB' },
    { id: 3, file: 'Bao_cao_doanh_thu_thang_10.xlsx', date: '2025-11-01 09:00', user: 'Admin', size: '3.2 MB' },
  ];

  // Filter report types
  const filteredReportTypes = reportTypes.filter(report =>
    report.title.toLowerCase().includes(reportSearchTerm.toLowerCase()) ||
    report.desc.toLowerCase().includes(reportSearchTerm.toLowerCase())
  );

  // Filter export history
  const filteredHistory = exportHistory.filter(item => {
    const matchesSearch = item.file.toLowerCase().includes(historySearchTerm.toLowerCase());
    
    let matchesDate = true;
    if (startDate || endDate) {
      const itemDateStr = item.date.split(' ')[0]; // Lấy phần ngày (YYYY-MM-DD)
      const itemDate = new Date(itemDateStr);
      itemDate.setHours(0, 0, 0, 0); // Reset giờ để so sánh chỉ ngày
      
      if (startDate && endDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchesDate = itemDate >= start && itemDate <= end;
      } else if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        matchesDate = itemDate >= start;
      } else if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchesDate = itemDate <= end;
      }
    }
    
    return matchesSearch && matchesDate;
  });

  const handleExport = (reportId) => {
    console.log('Export report:', reportId);
    // Logic xuất báo cáo
  };

  const handleDownload = (fileId) => {
    console.log('Download file:', fileId);
    // Logic tải xuống
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">BÁO CÁO & XUẤT DỮ LIỆU</h1>
          <p className="text-sm text-gray-500 mt-1">Tạo và xuất các loại báo cáo từ hệ thống</p>
        </div>
      </div>

      {/* Report Types Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm loại báo cáo..."
              value={reportSearchTerm}
              onChange={(e) => setReportSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Report Types */}
      {filteredReportTypes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <FaChartBar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Không tìm thấy loại báo cáo nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 ${report.color} rounded-lg flex items-center justify-center text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{report.title}</h3>
                  <p className="text-sm text-gray-600">{report.desc}</p>
                </div>
              </div>
              <button
                onClick={() => handleExport(report.id)}
                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                <FaFileExcel className="w-4 h-4" />
                <span>XUẤT EXCEL</span>
              </button>
            </div>
          );
          })}
        </div>
      )}

      {/* Export History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaChartBar className="w-6 h-6 text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-800">LỊCH SỬ XUẤT BÁO CÁO</h3>
            </div>
          </div>
          
          {/* History Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="relative flex-1 w-full">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên file..."
                value={historySearchTerm}
                onChange={(e) => setHistorySearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <div className="flex-1 md:flex-none md:w-48">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày bắt đầu</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex-1 md:flex-none md:w-48">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày kết thúc</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || undefined}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredHistory.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FaChartBar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p>{exportHistory.length === 0 ? 'Chưa có lịch sử xuất báo cáo' : 'Không tìm thấy kết quả phù hợp'}</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FaFileExcel className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{item.file}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {item.date} • {item.user} • {item.size}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(item.id)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold"
                >
                  <FaDownload className="w-4 h-4" />
                  <span>TẢI XUỐNG</span>
                </button>
              </div>
            ))
          )}
      </div>
      </div>
    </div>
  );
};

export default Reports;

