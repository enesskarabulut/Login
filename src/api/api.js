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
  if (!file) throw new Error("Yüklenecek dosya seçilmedi.");

  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onloadend = async () => {
      const fileData = reader.result.split(',')[1]; // Base64 format

      try {
        const payload = {
          file: { name: file.name, content: fileData },
        };

        // ID varsa, belirli bir arızaya yükle
        const endpoint = id ? `/arizalar?id=${id}` : `/arizalar`;
        const response = await api.patch(endpoint, payload);

        if (response.data && response.data.dokumanURL) {
          resolve(response.data.dokumanURL); // Başarıyla yüklenen URL
        } else {
          reject(new Error("Dosya yükleme başarısız veya URL alınamadı."));
        }
      } catch (error) {
        console.error("Dosya yükleme hatası:", error);
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Dosya okuma hatası oluştu."));
    };

    reader.readAsDataURL(file);
  });
};


// LOGOUT
export const logoutUser = () => {
  localStorage.removeItem('token'); // Token'i kaldır
};
