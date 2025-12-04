// Base URL của API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Helper function để lấy token từ localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function để gọi API
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  
  const defaultHeaders = {};
  
  // Chỉ set Content-Type nếu không phải FormData
  const isFormData = options.body instanceof FormData;
  if (!isFormData) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Xử lý response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Lỗi server' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    // Nếu response là file (Excel, PDF, etc.)
    const contentType = response.headers.get('content-type');
    if (contentType && (
      contentType.includes('application/vnd.openxmlformats-officedocument') ||
      contentType.includes('application/vnd.ms-excel') ||
      contentType.includes('application/pdf')
    )) {
      return response.blob();
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ==================== AUTHENTICATION ====================
export const authAPI = {
  login: async (email, password) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, matkhau: password }),
    });
  },
};

// ==================== USERS ====================
export const userAPI = {
  getAll: async () => {
    return apiCall('/users');
  },
  create: async (userData) => {
    return apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  update: async (id, userData) => {
    return apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  delete: async (id) => {
    return apiCall(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== TỈNH (PROVINCES) ====================
export const tinhAPI = {
  getAll: async () => {
    return apiCall('/tinh');
  },
  create: async (tinhData) => {
    return apiCall('/tinh', {
      method: 'POST',
      body: JSON.stringify(tinhData),
    });
  },
  update: async (id, tinhData) => {
    return apiCall(`/tinh/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tinhData),
    });
  },
  delete: async (id) => {
    return apiCall(`/tinh/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== TRẠM (STATIONS) ====================
export const tramAPI = {
  getAll: async () => {
    return apiCall('/tram');
  },
  create: async (tramData) => {
    return apiCall('/tram', {
      method: 'POST',
      body: JSON.stringify(tramData),
    });
  },
  update: async (id, tramData) => {
    return apiCall(`/tram/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tramData),
    });
  },
  delete: async (id) => {
    return apiCall(`/tram/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== CỘT (POLES) ====================
export const cotAPI = {
  getAll: async () => {
    return apiCall('/cot');
  },
  create: async (cotData) => {
    return apiCall('/cot', {
      method: 'POST',
      body: JSON.stringify(cotData),
    });
  },
  update: async (id, cotData) => {
    return apiCall(`/cot/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cotData),
    });
  },
  delete: async (id) => {
    return apiCall(`/cot/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== VOLUME KHÁC (OTHER VOLUMES) ====================
export const volumeOtherAPI = {
  getAll: async () => {
    return apiCall('/volume-other');
  },
  create: async (volumeData) => {
    return apiCall('/volume-other', {
      method: 'POST',
      body: JSON.stringify(volumeData),
    });
  },
  update: async (id, volumeData) => {
    return apiCall(`/volume-other/${id}`, {
      method: 'PUT',
      body: JSON.stringify(volumeData),
    });
  },
  delete: async (id) => {
    return apiCall(`/volume-other/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== HỢP ĐỒNG (CONTRACTS) ====================
export const hopdongAPI = {
  getAll: async () => {
    return apiCall('/hopdong');
  },
  getById: async (id) => {
    return apiCall(`/hopdong/${id}`);
  },
  create: async (hopdongData) => {
    return apiCall('/hopdong', {
      method: 'POST',
      body: JSON.stringify(hopdongData),
    });
  },
  update: async (id, hopdongData) => {
    return apiCall(`/hopdong/${id}`, {
      method: 'PUT',
      body: JSON.stringify(hopdongData),
    });
  },
  delete: async (id) => {
    return apiCall(`/hopdong/${id}`, {
      method: 'DELETE',
    });
  },
  getLichsu: async (id) => {
    return apiCall(`/hopdong/${id}/lichsu`);
  },
};

// ==================== HỢP ĐỒNG - CỘT ====================
export const hopdongCotAPI = {
  getAll: async (hopdongId) => {
    return apiCall(`/hopdong/${hopdongId}/cot`);
  },
  add: async (hopdongId, cotData) => {
    return apiCall(`/hopdong/${hopdongId}/cot`, {
      method: 'POST',
      body: JSON.stringify(cotData),
    });
  },
  update: async (hopdongId, cotId, cotData) => {
    return apiCall(`/hopdong/${hopdongId}/cot/${cotId}`, {
      method: 'PUT',
      body: JSON.stringify(cotData),
    });
  },
  delete: async (hopdongId, cotId) => {
    return apiCall(`/hopdong/${hopdongId}/cot/${cotId}`, {
      method: 'DELETE',
    });
  },
};

// ==================== HỢP ĐỒNG - VOLUME KHÁC ====================
export const hopdongVolumeOtherAPI = {
  getAll: async (hopdongId) => {
    return apiCall(`/hopdong/${hopdongId}/volume-other`);
  },
  add: async (hopdongId, volumeData) => {
    return apiCall(`/hopdong/${hopdongId}/volume-other`, {
      method: 'POST',
      body: JSON.stringify(volumeData),
    });
  },
  update: async (hopdongId, volumeId, volumeData) => {
    return apiCall(`/hopdong/${hopdongId}/volume-other/${volumeId}`, {
      method: 'PUT',
      body: JSON.stringify(volumeData),
    });
  },
  delete: async (hopdongId, volumeId) => {
    return apiCall(`/hopdong/${hopdongId}/volume-other/${volumeId}`, {
      method: 'DELETE',
    });
  },
};

// ==================== THỰC TẾ - CỘT ====================
export const thucteCotAPI = {
  getAll: async (hopdongId) => {
    return apiCall(`/hopdong/${hopdongId}/thucte`);
  },
  create: async (hopdongId, thucteData) => {
    return apiCall(`/hopdong/${hopdongId}/thucte`, {
      method: 'POST',
      body: JSON.stringify(thucteData),
    });
  },
  update: async (hopdongId, cotId, thucteData) => {
    return apiCall(`/hopdong/${hopdongId}/thucte/${cotId}`, {
      method: 'PUT',
      body: JSON.stringify(thucteData),
    });
  },
};

// ==================== THỰC TẾ - VOLUME KHÁC ====================
export const thucteVolumeOtherAPI = {
  getAll: async (hopdongId) => {
    return apiCall(`/hopdong/${hopdongId}/thucte-volume-other`);
  },
  create: async (hopdongId, thucteData) => {
    return apiCall(`/hopdong/${hopdongId}/thucte-volume-other`, {
      method: 'POST',
      body: JSON.stringify(thucteData),
    });
  },
  update: async (hopdongId, volumeId, thucteData) => {
    return apiCall(`/hopdong/${hopdongId}/thucte-volume-other/${volumeId}`, {
      method: 'PUT',
      body: JSON.stringify(thucteData),
    });
  },
};

// ==================== TIẾN ĐỘ (PROGRESS) ====================
export const tiendoAPI = {
  get: async (hopdongId) => {
    return apiCall(`/hopdong/${hopdongId}/tiendo`);
  },
  update: async (hopdongId, tiendoData) => {
    return apiCall(`/hopdong/${hopdongId}/tiendo`, {
      method: 'PUT',
      body: JSON.stringify(tiendoData),
    });
  },
};

// ==================== LỊCH SỬ (HISTORY) ====================
export const lichsuAPI = {
  getAll: async () => {
    return apiCall('/lichsu');
  },
};

// ==================== DASHBOARD ====================
export const dashboardAPI = {
  getOverview: async () => {
    return apiCall('/dashboard/overview');
  },
  getDoanhthu: async () => {
    return apiCall('/dashboard/doanhthu');
  },
  getTiendo: async () => {
    return apiCall('/dashboard/tiendo');
  },
};

// ==================== PHÂN CÔNG KHẢO SÁT ====================
export const phancongKhaosatAPI = {
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.hopdong_id) queryParams.append('hopdong_id', filters.hopdong_id);
    if (filters.ktv_id) queryParams.append('ktv_id', filters.ktv_id);
    if (filters.trangthai) queryParams.append('trangthai', filters.trangthai);
    
    const queryString = queryParams.toString();
    return apiCall(`/phancong-khaosat${queryString ? `?${queryString}` : ''}`);
  },
  getById: async (id) => {
    return apiCall(`/phancong-khaosat/${id}`);
  },
  create: async (phancongData) => {
    return apiCall('/phancong-khaosat', {
      method: 'POST',
      body: JSON.stringify(phancongData),
    });
  },
  update: async (id, phancongData) => {
    return apiCall(`/phancong-khaosat/${id}`, {
      method: 'PUT',
      body: JSON.stringify(phancongData),
    });
  },
  doiKTV: async (id, ktvId, ghichu) => {
    return apiCall(`/phancong-khaosat/${id}/doi-ktv`, {
      method: 'PUT',
      body: JSON.stringify({ ktv_id: ktvId, ghichu }),
    });
  },
  huy: async (id, ghichu) => {
    return apiCall(`/phancong-khaosat/${id}/huy`, {
      method: 'PUT',
      body: JSON.stringify({ ghichu }),
    });
  },
  delete: async (id) => {
    return apiCall(`/phancong-khaosat/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== EXPORT/IMPORT ====================
export const exportAPI = {
  hopdong: async () => {
    return apiCall('/export/hopdong');
  },
  tiendo: async () => {
    return apiCall('/export/tiendo');
  },
};

export const importAPI = {
  hopdong: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // apiCall sẽ tự động xử lý FormData (không set Content-Type)
    return apiCall('/import/hopdong', {
      method: 'POST',
      body: formData,
    });
  },
};

// Export default object chứa tất cả APIs
export default {
  auth: authAPI,
  user: userAPI,
  tinh: tinhAPI,
  tram: tramAPI,
  cot: cotAPI,
  volumeOther: volumeOtherAPI,
  hopdong: hopdongAPI,
  hopdongCot: hopdongCotAPI,
  hopdongVolumeOther: hopdongVolumeOtherAPI,
  thucteCot: thucteCotAPI,
  thucteVolumeOther: thucteVolumeOtherAPI,
  tiendo: tiendoAPI,
  lichsu: lichsuAPI,
  dashboard: dashboardAPI,
  phancongKhaosat: phancongKhaosatAPI,
  export: exportAPI,
  import: importAPI,
};

