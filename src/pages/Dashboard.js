import React, { useState } from 'react';
import ArizaForm from './ArizaForm';
import ArizaPage from './ArizaPage';

function Anasayfa() {
  const [activePage, setActivePage] = useState(''); // Hangi sayfanın gösterileceğini kontrol eder

  return (
    <div className="Anasayfa-container">
      <h1>Arıza Yönetim Sistemi</h1>
      {/* Seçim Menüsü */}
      <div className="Anasayfa-menu">
        <button onClick={() => setActivePage('new')}>Yeni Arıza Oluştur</button>
        <button onClick={() => setActivePage('list')}>Arızalar</button>
      </div>

      {/* Dinamik İçerik */}
      <div className="Anasayfa-content">
        {activePage === 'new' && <ArizaForm onCreate={(data) => console.log('Yeni Arıza:', data)} />}
        {activePage === 'list' && <ArizaPage />}
        {!activePage && <p>Lütfen bir seçenek seçin.</p>}
      </div>
    </div>
  );
}

export default Anasayfa;
