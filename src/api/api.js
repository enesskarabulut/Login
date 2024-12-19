import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = '/api';

// Axios instance oluşturuluyor
const api = axios.create({
  baseURL: API_URL,
});

// Her istek öncesinde token'i header'a ekleyen interceptor
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// LOGIN
export const loginUser = (credentials) =>
  api.post('/auth', credentials).then((response) => {
    const { token } = response.data;
    localStorage.setItem('token', token); // Token'i localStorage'e kaydediyoruz
    return response;
  });

// TÜM ARIZALARI GETİR
export const fetchArizalar = (params) => api.get('/arizalar', { params });

// TEK BİR ARIZA GETİR
export const fetchArizaById = (id) => api.get(`/arizalar?id=${id}`);

// YENİ ARIZA OLUŞTUR
export const createAriza = (data) => api.post('/arizalar', data);

// ARIZA GÜNCELLE
export const updateAriza = (id, data) => api.put(`/arizalar?id=${id}`, data);

// ARIZA SİL
export const deleteAriza = (id) => api.delete(`/arizalar?id=${id}`);

// Dosya yükle
export const uploadDokuman = async (id, file) => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onloadend = async () => {
      const fileData = reader.result.split(',')[1]; // Base64 format
      try {
        const response = await api.patch(`/arizalar?id=${id}`, {
          file: { name: file.name, content: fileData },
        });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsDataURL(file);
  });
};

// LOGOUT
export const logoutUser = () => {
  localStorage.removeItem('token'); // Token'i kaldır
};
