import React, { useState, useEffect, useRef } from 'react';
import { fetchArizalar, createAriza, deleteAriza } from '../api/api';
import ArizaList from '../components/ArizaList';
import ArizaForm from '../components/ArizaForm';
import ArizaFilter from '../components/ArizaFilter';
import ArizaDetailPage from './ArizaDetailPage';

function ArizaPage() {
  const [arizalar, setArizalar] = useState([]);
  const [selectedArizaId, setSelectedArizaId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('Anasayfa');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentStatus, setCurrentStatus] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const detailRef = useRef(null); // Detay bölgesi için referans
  const limit = 10;

  const loadArizalar = async (status = currentStatus, page = 1) => {
    setLoading(true);
    try {
      const { data } = await fetchArizalar({ status, page, limit });
      if (page === 1) {
        setArizalar(data);
      } else {
        setArizalar((prevArizalar) => [...prevArizalar, ...data]);
      }
      setCurrentStatus(status);
    } catch (error) {
      console.error('Arızalar yüklenirken hata oluştu:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedView === 'arizalar') loadArizalar();
  }, [selectedView]);

  const handleFilter = (status) => {
    setCurrentPage(1);
    loadArizalar(status);
    setSelectedArizaId(null);
  };

  const handleCreate = async (arizaData) => {
    setIsCreating(true);
    setSuccessMessage('');
    try {
      const newAriza = await createAriza(arizaData);
      const arizaId = newAriza?.id || newAriza?.data?.id;

      if (arizaId) {
        loadArizalar();
        setSuccessMessage(`"${arizaId}" ID'li arıza oluşturuldu.`);
        setTimeout(() => setSuccessMessage(''), 2000);
      }
    } catch (error) {
      console.error('Arıza oluşturulurken hata oluştu:', error.message);
      setSuccessMessage('Arıza oluşturulurken hata oluştu.');
      setTimeout(() => setSuccessMessage(''), 2000);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id) => {
    setArizalar([]);
    await deleteAriza(id);
    if (selectedArizaId === id) setSelectedArizaId(null);
    loadArizalar(currentStatus, 1);
  };

  const handleViewChange = (view) => {
    setSelectedView(view);
    setSelectedArizaId(null);
    setCurrentPage(1);
    setArizalar([]);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadArizalar(currentStatus, nextPage);
  };

  // Arıza detayı tamamen yüklendiğinde çağrılır
  const handleDetailLoaded = () => {
    if (detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div>
      {/* Başlık ve Butonlar */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Arıza Kayıt Sistemi</h1>
        <div className="view-buttons" style={{ marginTop: '10px' }}>
          <button onClick={() => handleViewChange('Anasayfa')} className={selectedView === 'Anasayfa' ? 'active' : ''}>
            Anasayfa
          </button>
          <button onClick={() => handleViewChange('yeniAriza')} className={selectedView === 'yeniAriza' ? 'active' : ''}>
            Yeni Arıza Oluştur
          </button>
          <button onClick={() => handleViewChange('arizalar')} className={selectedView === 'arizalar' ? 'active' : ''}>
            Arızalar
          </button>
        </div>
      </div>

      {/* Overlay Ekran Karartma */}
      {isCreating && (
        <div className="overlay">
          <span>Arıza oluşturuluyor...</span>
        </div>
      )}

      {/* Başarı Mesajı */}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {/* Seçilen Ekrana Göre İçerikler */}
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
            onSelect={(id) => setSelectedArizaId(id)}
            onDelete={handleDelete}
            selectedArizaId={selectedArizaId}
          />

          {/* Diğer Arızalar Butonu */}
          {arizalar.length >= limit * currentPage && (
            <div className="load-more-container">
              <button onClick={handleLoadMore}>Diğer Arızalar</button>
            </div>
          )}

          {/* Arıza Detay Sayfası */}
          {selectedArizaId && (
            <div ref={detailRef}>
              <ArizaDetailPage
                id={selectedArizaId}
                loadArizalar={() => loadArizalar(currentStatus, 1)}
                onDetailLoaded={handleDetailLoaded}
                onClose={() => setSelectedArizaId(null)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ArizaPage;
