import React, { useState, useEffect } from 'react';
import { fetchArizalar, createAriza, deleteAriza, uploadDokuman } from '../api/api';
import ArizaList from '../components/ArizaList';
import ArizaForm from '../components/ArizaForm';
import ArizaFilter from '../components/ArizaFilter';
import ArizaDetailPage from './ArizaDetailPage';

function ArizaPage() {
  const [arizalar, setArizalar] = useState([]);
  const [selectedArizaId, setSelectedArizaId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tüm arızaları yükler
  const loadArizalar = async (status) => {
    setLoading(true);
    const { data } = await fetchArizalar(status ? { status } : {});
    setArizalar(data);
    setLoading(false);
  };

  useEffect(() => {
    loadArizalar();
  }, []);

  const handleFilter = (status) => {
    loadArizalar(status);
    setSelectedArizaId(null); // Filtreleme yapıldığında arıza detayını kapat
  };

  const handleCreate = async (arizaData) => {
    await createAriza(arizaData);
    loadArizalar();
  };

  const handleDelete = async (id) => {
    await deleteAriza(id);
    if (selectedArizaId === id) {
      setSelectedArizaId(null);
    }
    loadArizalar();
  };

  const handleUpload = async (file) => {
    if (!file) return;

    try {
      // Yeni arıza oluşturulurken döküman yükle
      const uploadedURL = await uploadDokuman(null, file); // ID'siz yükleme
      console.log('Yüklenen dosya URL:', uploadedURL);
      return uploadedURL;
    } catch (error) {
      console.error('Dosya yükleme hatası:', error.message);
      throw error;
    }
  };

  return (
    <div>
      <h1>Arıza Kayıt Sistemi</h1>
      <ArizaForm onCreate={handleCreate} onUpload={handleUpload} />
      <ArizaFilter onFilter={handleFilter} />
      <ArizaList
        loading={loading}
        arizalar={arizalar}
        onSelect={setSelectedArizaId}
        onDelete={handleDelete}
      />
      {selectedArizaId && (
        <ArizaDetailPage
          id={selectedArizaId}
          loadArizalar={loadArizalar}
          onClose={() => setSelectedArizaId(null)}
        />
      )}
    </div>
  );
}

export default ArizaPage;
