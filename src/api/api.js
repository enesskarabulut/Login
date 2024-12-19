import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = '/api';

// Token'i axios'un default header'ına ekle
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

// Login
export const loginUser = (credentials) =>
  api.post('/auth', credentials).then((response) => {
    const { token } = response.data;
    localStorage.setItem('token', token); // Token'i kaydet
    return response;
  });

// Tüm arızaları getir
export const fetchArizalar = (params) => api.get('/arizalar', { params });

// Tek bir arıza kaydını getir
export const fetchArizaById = (id) => api.get(`/arizalar?id=${id}`);

// Yeni arıza oluştur
export const createAriza = (data) => api.post('/arizalar', data);

// Arıza güncelle
export const updateAriza = (id, data) => api.put(`/arizalar?id=${id}`, data);

// Arıza sil
export const deleteAriza = (id) => api.delete(`/arizalar?id=${id}`);

// Dosya yükle
export const uploadDokuman = (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`/arizalar/${id}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
