import React, { useState, useEffect } from 'react';
import { fetchArizalar, createAriza, deleteAriza } from '../api/api';
import ArizaList from '../components/ArizaList';
import ArizaForm from '../components/ArizaForm';
import ArizaFilter from '../components/ArizaFilter';
import ArizaDetailPage from './ArizaDetailPage';

function ArizaPage() {
  const [arizalar, setArizalar] = useState([]);
  const [selectedArizaId, setSelectedArizaId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('Anasayfa'); // Ekran seçimi için state
  const [currentPage, setCurrentPage] = useState(1); // Sayfa numarası
  const [currentStatus, setCurrentStatus] = useState(''); // Filtrelenmiş status
  const limit = 10; // Her sayfada gösterilecek kayıt sayısı

  // Arızaları yükle
  const loadArizalar = async (status = currentStatus, page = 1) => {
    setLoading(true);
    try {
      const { data } = await fetchArizalar({
        status,
        page,
        limit,
      });

      if (page === 1) {
        setArizalar(data); // İlk sayfa için listeyi sıfırla
      } else {
        setArizalar((prevArizalar) => [...prevArizalar, ...data]); // Diğer sayfaları mevcut listeye ekle
      }

      setCurrentStatus(status); // Mevcut filtreyi kaydet
      setLoading(false);
    } catch (error) {
      console.error("Arızalar yüklenirken hata oluştu:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedView === 'arizalar') loadArizalar();
  }, [selectedView]);

  // Filtreleme işlemi
  const handleFilter = (status) => {
    setCurrentPage(1); // Sayfayı başa döndür
    loadArizalar(status);
    setSelectedArizaId(null);
  };

  // Yeni arıza oluştur
  const handleCreate = async (arizaData) => {
    await createAriza(arizaData);
    loadArizalar();
  };

  // Arıza silme işlemi
  const handleDelete = async (id) => {
    await deleteAriza(id);
    if (selectedArizaId === id) setSelectedArizaId(null);
    loadArizalar(currentStatus, 1);
  };

  // Ekranı değiştirme fonksiyonu
  const handleViewChange = (view) => {
    setSelectedView(view);
    setSelectedArizaId(null); // Detay sayfasını kapat
    setCurrentPage(1); // Sayfayı başa döndür
    setArizalar([]); // Önceki listeyi temizle
  };

  // "Diğer Arızalar" butonu tıklandığında
  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadArizalar(currentStatus, nextPage);
  };

  return (
    <div>
      <h1>Arıza Kayıt Sistemi</h1>

      {/* Anasayfa Seçim Butonları */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button
          onClick={() => handleViewChange('Anasayfa')}
          style={{
            marginRight: '10px',
            backgroundColor: selectedView === 'Anasayfa' ? '#007bff' : '#ccc',
            color: 'white',
            padding: '10px',
          }}
        >
          Anasayfa
        </button>
        <button
          onClick={() => handleViewChange('yeniAriza')}
          style={{
            marginRight: '10px',
            backgroundColor: selectedView === 'yeniAriza' ? '#007bff' : '#ccc',
            color: 'white',
            padding: '10px',
          }}
        >
          Yeni Arıza Oluştur
        </button>
        <button
          onClick={() => handleViewChange('arizalar')}
          style={{
            backgroundColor: selectedView === 'arizalar' ? '#007bff' : '#ccc',
            color: 'white',
            padding: '10px',
          }}
        >
          Arızalar
        </button>
      </div>

      {/* Seçilen Ekrana Göre Bileşenleri Göster */}
      {selectedView === 'Anasayfa' && (
        <div>
          <h2>Anasayfa</h2>
          <p>Hoşgeldiniz! Buradan yeni arıza ekleyebilir veya mevcut arızaları görüntüleyebilirsiniz.</p>
        </div>
      )}

      {selectedView === 'yeniAriza' && <ArizaForm onCreate={handleCreate} />}

      {selectedView === 'arizalar' && (
        <>
          <ArizaFilter onFilter={handleFilter} />
          <ArizaList
            loading={loading}
            arizalar={arizalar}
            onSelect={setSelectedArizaId}
            onDelete={handleDelete}
          />

          {/* Diğer Arızalar Butonu */}
          {arizalar.length >= limit * currentPage && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                onClick={handleLoadMore}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Diğer Arızalar
              </button>
            </div>
          )}

          {/* Arıza Detay Sayfası */}
          {selectedArizaId && (
            <ArizaDetailPage
              id={selectedArizaId}
              loadArizalar={() => loadArizalar(currentStatus, 1)}
              onClose={() => setSelectedArizaId(null)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ArizaPage;
