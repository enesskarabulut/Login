import React, { useState } from 'react';

function ArizaList({ arizalar, onSelect, onDelete }) {
  const [loadingId, setLoadingId] = useState(null); // Silme sırasında loading ID'sini tutar
  const [error, setError] = useState(null); // Hata mesajını tutar

  // Tarih formatlama fonksiyonu: Yıl-Ay-Gün => Gün.Ay.Yıl
  const formatDateToString = (date) => {
    if (!date) return '-';
    const [year, month, day] = date.split('-');
    return `${day}.${month}.${year}`;
  };

  const handleDelete = async (id) => {
    setLoadingId(id); // Loading başlat
    setError(null); // Önceki hatayı temizle

    try {
      await onDelete(id); // Silme işlemini çağır
    } catch (err) {
      setError(`Arıza silinirken hata oluştu: ${err.message || 'Bilinmeyen hata'}`);
    } finally {
      setLoadingId(null); // Loading durumunu temizle
    }
  };

  return (
    <div className="table-container">
      <h2>Arızalar</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Adres</th>
            <th>Usta</th>
            <th>Status</th>
            <th>Ücret</th>
            <th>Tarih</th>
            <th>Detay</th>
            <th>Dökümanlar</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {arizalar.map((ariza) => (
            <tr key={ariza.id}>
              <td onClick={() => onSelect(ariza.id)} style={{ cursor: 'pointer' }}>
                {ariza.id}
              </td>
              <td>{ariza.adres}</td>
              <td>{ariza.usta}</td>
              <td>{ariza.status}</td>
              <td>{ariza.ucret || '-'}</td>
              {/* Tarih formatlama */}
              <td>{formatDateToString(ariza.tarih)}</td>
              <td>{ariza.detay || '-'}</td>
              {/* Dökümanlar alanı */}
              <td>
                {ariza.dokuman ? (
                  <a
                    href={ariza.dokuman}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#007BFF', textDecoration: 'underline' }}
                  >
                    Dökümanı Görüntüle
                  </a>
                ) : (
                  '-'
                )}
              </td>
              <td>
                <button
                  onClick={() => handleDelete(ariza.id)}
                  disabled={loadingId === ariza.id}
                  style={{
                    backgroundColor: loadingId === ariza.id ? '#ccc' : '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    cursor: loadingId === ariza.id ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loadingId === ariza.id ? 'Siliniyor...' : 'Sil'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ArizaList;
