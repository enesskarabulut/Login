import axios from 'axios';

const API_URL = '/api';

// Login
export const loginUser = (credentials) => axios.post(`${API_URL}/auth`, credentials);

// Tüm arızaları getir
export const fetchArizalar = (params) => axios.get(`${API_URL}/arizalar`, { params });

// Tek bir arıza kaydını getir
export const fetchArizaById = (id) => axios.get(`${API_URL}/arizalar/${id}`);

// Yeni arıza oluştur
export const createAriza = (data) => axios.post(`${API_URL}/arizalar`, data);

// Arıza güncelle
export const updateAriza = (id, data) => axios.put(`${API_URL}/arizalar/${id}`, data);

// Arıza sil
export const deleteAriza = (id) => axios.delete(`${API_URL}/arizalar/${id}`);

// Dosya yükle
export const uploadDokuman = (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_URL}/arizalar/${id}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
