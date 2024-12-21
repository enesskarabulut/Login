import React, { useState } from 'react';

function ArizaFilter({ onFilter }) {
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState({
    name: '',
    surname: '',
    msisdn: '',
    il: '',
    ilce: '',
    mahalle: '',
    binaNo: '',
    daireNo: '',
    usta: '',
    status: '',
    ucret: '',
    tarih: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilter = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    const emptyFilters = {
      name: '',
      surname: '',
      msisdn: '',
      il: '',
      ilce: '',
      mahalle: '',
      binaNo: '',
      daireNo: '',
      usta: '',
      status: '',
      ucret: '',
      tarih: '',
    };
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  return (
    <div className="filter-container" style={{ marginBottom: '1em', textAlign: 'center' }}>
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)} 
        className='filter-button'
        style={{ 
          marginBottom: '0.5em',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          padding: '10px 15px',
          cursor: 'pointer',
          borderRadius: '4px',
        }}
      >
        {isOpen ? 'Filtreyi Kapat' : 'Filtreyi Aç'}
      </button>

      {isOpen && (
        <form 
          onSubmit={handleFilter} 
          style={{ 
            maxWidth: '800px',
            margin: '0 auto',
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px,1fr))', 
            gap: '1em',
            padding: '1em',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
          }}
        >
          {/* Ortak stil alanları */}
          {[
            { label: 'Müşteri Adı:', name: 'name', placeholder: '' },
            { label: 'Müşteri Soyadı:', name: 'surname', placeholder: '' },
            { label: 'Telefon Numarası:', name: 'msisdn', placeholder: '05XXXXXXXXX' },
            { label: 'İl:', name: 'il', placeholder: '' },
            { label: 'İlçe:', name: 'ilce', placeholder: '' },
            { label: 'Mahalle:', name: 'mahalle', placeholder: '' },
            { label: 'Bina No:', name: 'binaNo', placeholder: '' },
            { label: 'Daire No:', name: 'daireNo', placeholder: '' },
            { label: 'Usta:', name: 'usta', placeholder: '' },
          ].map((field) => (
            <div key={field.name} style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>{field.label}</label>
              <input 
                name={field.name} 
                value={filters[field.name]} 
                onChange={handleChange} 
                placeholder={field.placeholder}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
              />
            </div>
          ))}

          {/* Status */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Status:</label>
            <select 
              name="status" 
              value={filters.status} 
              onChange={handleChange} 
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">Tümü</option>
              <option value="işleme alındı">işleme alındı</option>
              <option value="tamamlandı">tamamlandı</option>
              <option value="ertelendi">ertelendi</option>
              <option value="ileri tarihli">ileri tarihli</option>
            </select>
          </div>

          {/* Ücret */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Ücret:</label>
            <input 
              type="number" 
              name="ucret" 
              value={filters.ucret} 
              onChange={handleChange} 
              placeholder="örn: 100.00"
              step="0.01"
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          {/* Tarih */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Tarih:</label>
            <input 
              type="date" 
              name="tarih" 
              value={filters.tarih} 
              onChange={handleChange}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
            <button 
              type="submit" 
              className='filter-button'
              style={{
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Filtrele
            </button>
            <button 
              type="button" 
              onClick={handleReset} 
              className='filter-button' 
              style={{ 
                backgroundColor: '#6c757d', 
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Temizle
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ArizaFilter;
