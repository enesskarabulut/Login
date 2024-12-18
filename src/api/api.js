import axios from 'axios';

const API_URL = 'http://localhost:3001/api'; // Backend endpoint'i

export const fetchArizalar = async (params = {}) => {
    return await axios.get(`${API_URL}/arizalar`, { params });
};

export const fetchArizaById = async (id) => {
    return await axios.get(`${API_URL}/arizalar/${id}`);
};

export const createAriza = async (data) => {
    return await axios.post(`${API_URL}/arizalar`, data);
};

export const updateAriza = async (id, data) => {
    return await axios.put(`${API_URL}/arizalar/${id}`, data);
};

export const deleteAriza = async (id) => {
    return await axios.delete(`${API_URL}/arizalar/${id}`);
};

export const uploadDokuman = async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return await axios.post(`${API_URL}/arizalar/${id}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
