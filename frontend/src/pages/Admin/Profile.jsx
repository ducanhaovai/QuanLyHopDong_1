import React, { useState } from 'react';
import { HiUser } from 'react-icons/hi';
import { FaEdit, FaSave, FaLock, FaEnvelope, FaUserTag } from 'react-icons/fa';

const Profile = () => {
  const userStr = localStorage.getItem('user');
  const userData = userStr ? JSON.parse(userStr) : null;
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    ten: userData?.ten || '',
    email: userData?.email || '',
    vaitro: userData?.vaitro || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Validation
    if (!formData.ten || !formData.email) {
      setMessage({ type: 'error', text: 'Vui lòng điền đầy đủ thông tin' });
      return;
    }

    // Update localStorage
    const updatedUser = {
      ...userData,
      ...formData
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    setMessage({ type: 'success', text: 'Cập nhật thông tin thành công' });
    setIsEditing(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleChangePassword = () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Vui lòng điền đầy đủ thông tin mật khẩu' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu mới và xác nhận không khớp' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
      return;
    }

    // Update password logic here
    setMessage({ type: 'success', text: 'Đổi mật khẩu thành công' });
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setShowPasswordSection(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  if (!userData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">HỒ SƠ CÁ NHÂN</h1>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <HiUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Chưa có thông tin người dùng</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">HỒ SƠ CÁ NHÂN</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý thông tin tài khoản của bạn</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            <FaEdit className="w-4 h-4" />
            <span>CHỈNH SỬA</span>
          </button>
        )}
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            <HiUser className="w-12 h-12 text-gray-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{formData.ten || userData.ten}</h2>
            <p className="text-gray-600">{formData.email || userData.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {formData.vaitro || userData.vaitro || 'Người dùng'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tên */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <HiUser className="w-4 h-4" />
              <span>Tên</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                name="ten"
                value={formData.ten}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Nhập tên"
              />
            ) : (
              <p className="text-gray-800 px-4 py-2 bg-gray-50 rounded-lg">{formData.ten || 'N/A'}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FaEnvelope className="w-4 h-4" />
              <span>Email</span>
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Nhập email"
              />
            ) : (
              <p className="text-gray-800 px-4 py-2 bg-gray-50 rounded-lg">{formData.email || 'N/A'}</p>
            )}
          </div>

          {/* Vai trò */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FaUserTag className="w-4 h-4" />
              <span>Vai trò</span>
            </label>
            {isEditing ? (
              <select
                name="vaitro"
                value={formData.vaitro}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="admin">Quản trị viên</option>
                <option value="manager">Quản lý</option>
                <option value="user">Người dùng</option>
              </select>
            ) : (
              <p className="text-gray-800 px-4 py-2 bg-gray-50 rounded-lg">{formData.vaitro || 'N/A'}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  ten: userData.ten || '',
                  email: userData.email || '',
                  vaitro: userData.vaitro || '',
                });
                setMessage({ type: '', text: '' });
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
            >
              HỦY
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              <FaSave className="w-4 h-4" />
              <span>LƯU THAY ĐỔI</span>
            </button>
          </div>
        )}
      </div>

      {/* Change Password Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FaLock className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">ĐỔI MẬT KHẨU</h3>
          </div>
          {!showPasswordSection && (
            <button
              onClick={() => setShowPasswordSection(true)}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold"
            >
              ĐỔI MẬT KHẨU
            </button>
          )}
        </div>

        {showPasswordSection && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu hiện tại</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu mới</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Nhập mật khẩu mới"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => {
                  setShowPasswordSection(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                  setMessage({ type: '', text: '' });
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
              >
                HỦY
              </button>
              <button
                onClick={handleChangePassword}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                <FaLock className="w-4 h-4" />
                <span>ĐỔI MẬT KHẨU</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

