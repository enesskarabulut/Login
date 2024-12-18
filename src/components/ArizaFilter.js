import React, { useState } from 'react';

function ArizaFilter({ onFilter }) {
  const [status, setStatus] = useState('');

  const handleFilter = () => {
    onFilter(status);
  };

  return (
    <div className="filter-container">
      <div style={{ flex: 1 }}>
        <label>Status Filtre:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tümü</option>
          <option value="işleme alındı">işleme alındı</option>
          <option value="tamamlandı">tamamlandı</option>
          <option value="ertelendi">ertelendi</option>
          <option value="ileri tarihli">ileri tarihli</option>
        </select>
      </div>
      <button onClick={handleFilter}>Filtrele</button>
    </div>
  );
}

export default ArizaFilter;
