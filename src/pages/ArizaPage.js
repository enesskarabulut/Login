import React, { useState, useEffect } from 'react';
import { fetchArizalar, createAriza, deleteAriza } from '../api/api';
import ArizaList from '../components/ArizaList';
import ArizaForm from '../components/ArizaForm';
import ArizaFilter from '../components/ArizaFilter';
import ArizaDetailPage from './ArizaDetailPage';

function ArizaPage() {
  const [arizalar, setArizalar] = useState([]);
  const [selectedArizaId, setSelectedArizaId] = useState(null);
  const [loading, setLoading]  = useState(true)

  const loadArizalar = async (status) => {
    const { data } = await fetchArizalar(status ? { status } : {});
    setArizalar(data);
    setLoading(false)
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
    setLoading(true)
    loadArizalar();
  };

  return (
    <div>
      <h1>Arıza Kayıt Sistemi</h1>
      <ArizaForm onCreate={handleCreate} />
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