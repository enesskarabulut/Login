import React, { useState, useEffect, useRef } from 'react';
import { fetchArizalar, createAriza, deleteAriza } from '../api/api';
import ArizaList from '../components/ArizaList';
import ArizaForm from '../components/ArizaForm';
import ArizaFilter from '../components/ArizaFilter';
import ArizaDetailPage from './ArizaDetailPage';
import ArizaMap from '../components/ArizaMap'; // ArizaMap bileşenini ekledik.
import 'leaflet/dist/leaflet.css';
import { removeToken } from '../utils/auth';


function ArizaPage({setIsAuthenticated}) {
  const [arizalar, setArizalar] = useState([]);
  const [selectedArizaId, setSelectedArizaId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('Anasayfa');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [isCreating, setIsCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [filtering, setFiltering] = useState(false);
  const detailRef = useRef(null);
  const limit = 10;

  const loadArizalar = async (givenFilters = filters, page = 1) => {
    setLoading(true);
    try {
      const { data } = await fetchArizalar({ ...givenFilters, page, limit });
      console.log('Gelen Arızalar:', data); // Gelen API yanıtını konsola yazdır.
      if (page === 1) {
        setArizalar(data);
      } else {
        setArizalar((prevArizalar) => [...prevArizalar, ...data]);
      }
    } catch (error) {
      console.error('Arızalar yüklenirken hata oluştu:', error.message);
    } finally {
      setLoading(false);
      setFiltering(false);
    }
  };

  useEffect(() => {
    if (selectedView === 'arizalar' || selectedView === 'Anasayfa') {
      loadArizalar(filters, currentPage);
    }
  }, [selectedView]);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setFiltering(true);
    if (selectedView === 'arizalar' || selectedView === 'Anasayfa') {
      loadArizalar(newFilters, 1);
      setSelectedArizaId(null);
    } else {
      setFiltering(false);
    }
  };

  const handleCreate = async (arizaData) => {
    setIsCreating(true);
    setSuccessMessage('');
    try {
      const newAriza = await createAriza(arizaData);
      const arizaId = newAriza?.id || newAriza?.data?.id;

      if (arizaId) {
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
    setCurrentPage(1);
    loadArizalar(filters, 1);
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
    loadArizalar(filters, nextPage);
  };

  const handleDetailLoaded = () => {
    if (detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
  };
  return (
    <div style={{ position: 'relative' }}>
      <div className='logoutButtonContainer'>
        <button
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </button>
      </div>
      {filtering && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px 40px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)'
          }}>
            <h3>Filtre uygulanıyor, lütfen bekleyiniz...</h3>
          </div>
        </div>
      )}

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

      {isCreating && (
        <div className="overlay">
          <span>Arıza oluşturuluyor...</span>
        </div>
      )}

      {successMessage && <div className="success-message">{successMessage}</div>}

      {selectedView === 'Anasayfa' && (
        <div>
          <p style={{ textAlign: 'center', margin: '10px 0', color: '#666' }}>
            Harita üzerinde arızaların bulunduğu mahallelerin konumlarını görebilirsiniz.
          </p>
          <div className="map-wrapper">
            <ArizaMap arizalar={arizalar} />
          </div>
        </div>
      )}

      {selectedView === 'yeniAriza' && <ArizaForm onCreate={handleCreate} />}

      {selectedView === 'arizalar' && (
        <>
          <ArizaFilter onFilter={handleFilter} />
          <ArizaList
            setCurrentPage={setCurrentPage}
            loading={loading}
            arizalar={arizalar}
            onSelect={(id) => setSelectedArizaId(id)}
            onDelete={handleDelete}
            selectedArizaId={selectedArizaId}
          />

          {arizalar.length >= limit * currentPage && (
            <div className="load-more-container">
              <button onClick={handleLoadMore}>Diğer Arızalar</button>
            </div>
          )}

          {selectedArizaId && (
            <div ref={detailRef}>
              <ArizaDetailPage
                id={selectedArizaId}
                loadArizalar={() => loadArizalar(filters, 1)}
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