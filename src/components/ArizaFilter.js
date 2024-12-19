import React, { useState } from 'react';

function ArizaFilter({ onFilter }) {
  const [status, setStatus] = useState('');

  const handleFilter = (e) => {
    e.preventDefault();
    onFilter(status);
  };

  return (
    <form onSubmit={handleFilter} className="filter-container">
      <div style={{ flex: 1 }}>
        <label>Status Filtre:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tümü</option>
          <option value="İşleme alındı">İşleme alındı</option>
          <option value="Tamamlandı">Tamamlandı</option>
          <option value="Ertelendi">Ertelendi</option>
          <option value="ileri tarihli">İleri tarihli</option>
        </select>
      </div>
      <button className='filter-button' type="submit">Filtrele</button>
    </form>
  );
}

export default ArizaFilter;
