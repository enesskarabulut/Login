import React, { useState, useEffect } from 'react';
import antalyaData from '../data/antalya.json'; // JSON dosyasının yolunu doğru ayarladığınızdan emin olun

function ArizaFilter({ onFilter }) {
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState({
    name: '',
    surname: '',
    msisdn: '',
    il: 'ANTALYA',
    ilce: '',
    mahalle: '',
    status: '',
    ucretAraligi: '',
  });

  const [ilceler, setIlceler] = useState([]);
  const [mahalleler, setMahalleler] = useState([]);

  // İl seçilince ilçe listesini güncelle
  useEffect(() => {
    if (filters.il) {
      const ilceListesi = Object.keys(antalyaData[filters.il] || {});
      setIlceler(ilceListesi);
      // İl değiştiğinde ilçe ve mahalle sıfırlansın
      setFilters((prev) => ({ ...prev, ilce: '', mahalle: '' }));
    }
  }, [filters.il]);

  // İlçe seçilince mahalle listesini güncelle
  useEffect(() => {
    if (filters.ilce) {
      const mahalleListesi = antalyaData[filters.il][filters.ilce] || [];
      setMahalleler(mahalleListesi);
      // İlçe değiştiğinde mahalle sıfırlansın
      setFilters((prev) => ({ ...prev, mahalle: '' }));
    }
  }, [filters.ilce, filters.il]);

  // Form alanları değiştikçe filtre objesini güncelle
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Filtreleme butonuna basıldığında üst komponenti bilgilendir
  const handleFilter = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  // Temizle butonuna basıldığında her şeyi sıfırla
  const handleReset = () => {
    const emptyFilters = {
      name: '',
      surname: '',
      msisdn: '',
      il: 'ANTALYA',
      ilce: '',
      mahalle: '',
      status: '',
      ucretAraligi: '',
    };
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  return (
    <div className="ariza-filter-container" style={styles.filterContainerOuter}>
      {/* Filtre Aç/Kapat Butonu */}
      <div style={styles.toggleRow}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={styles.toggleButton}
        >
          {isOpen ? 'Filtreyi Kapat' : 'Filtreyi Aç'}
        </button>
      </div>

      {isOpen && (
        <form className='filterFormContainer' onSubmit={handleFilter} style={styles.filterForm}>
          {/* Müşteri Adı */}
          <div className="filter-input-group" style={styles.inputGroup}>
            <label style={styles.label}>Müşteri Adı:</label>
            <input
              name="name"
              value={filters.name}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          {/* Müşteri Soyadı */}
          <div className="filter-input-group" style={styles.inputGroup}>
            <label style={styles.label}>Müşteri Soyadı:</label>
            <input
              name="surname"
              value={filters.surname}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          {/* Telefon Numarası */}
          <div className="filter-input-group" style={styles.inputGroup}>
            <label style={styles.label}>Telefon Numarası:</label>
            <input
              name="msisdn"
              value={filters.msisdn}
              onChange={handleChange}
              placeholder="05XXXXXXXXX"
              style={styles.input}
            />
          </div>

          {/* İl */}
          <div className="filter-input-group" style={styles.inputGroup}>
            <label style={styles.label}>İl:</label>
            <select
              name="il"
              value={filters.il}
              onChange={handleChange}
              style={styles.select}
            >
              {Object.keys(antalyaData).map((il) => (
                <option key={il} value={il}>
                  {il}
                </option>
              ))}
            </select>
          </div>

          {/* İlçe */}
          <div className="filter-input-group" style={styles.inputGroup}>
            <label style={styles.label}>İlçe:</label>
            <select
              name="ilce"
              value={filters.ilce}
              onChange={handleChange}
              style={styles.select}
              disabled={!filters.il}
            >
              <option value="">Tümü</option>
              {ilceler.map((ilce) => (
                <option key={ilce} value={ilce}>
                  {ilce}
                </option>
              ))}
            </select>
          </div>

          {/* Mahalle */}
          <div className="filter-input-group" style={styles.inputGroup}>
            <label style={styles.label}>Mahalle:</label>
            <select
              name="mahalle"
              value={filters.mahalle}
              onChange={handleChange}
              style={styles.select}
              disabled={!filters.ilce}
            >
              <option value="">Tümü</option>
              {mahalleler.map((mahalle) => (
                <option key={mahalle} value={mahalle}>
                  {mahalle}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="filter-input-group" style={styles.inputGroup}>
            <label style={styles.label}>Status:</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">Tümü</option>
              <option value="işleme alındı">işleme alındı</option>
              <option value="tamamlandı">tamamlandı</option>
              <option value="ertelendi">ertelendi</option>
              <option value="ileri tarihli">ileri tarihli</option>
            </select>
          </div>

          {/* Ücret Aralığı */}
          <div className="filter-input-group" style={styles.inputGroup}>
            <label style={styles.label}>Ücret Aralığı:</label>
            <select
              name="ucretAraligi"
              value={filters.ucretAraligi}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">Tümü</option>
              <option value="1-50">1-50 TL</option>
              <option value="50-250">50-250 TL</option>
              <option value="250-500">250-500 TL</option>
              <option value="500+">500 TL üstü</option>
            </select>
          </div>

          {/* Filtrele ve Temizle Butonları */}
          <div style={styles.buttonRow}>
            <button type="submit" style={{ ...styles.button, backgroundColor: '#28a745' }}>
              Filtrele
            </button>
            <button
              type="button"
              onClick={handleReset}
              style={{ ...styles.button, backgroundColor: '#6c757d' }}
            >
              Temizle
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/* Stil nesneleri */
const styles = {
  filterContainerOuter: {
    margin: '0 auto',
    marginBottom: '1em',
    maxWidth: '1200px',
    backgroundColor: '#fff',
    borderRadius: '6px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    padding: '0.5em',
  },
  toggleRow: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  toggleButton: {
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  filterForm: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '0.5em',
    marginTop: '0.5em',
    padding: '0.5em',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '3px',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  input: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  select: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  buttonRow: {
    gridColumn: '1 / -1',
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginTop: '0.5em',
  },
  button: {
    color: '#fff',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default ArizaFilter;
