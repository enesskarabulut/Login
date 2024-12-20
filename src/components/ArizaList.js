import React, { useState } from 'react';

function ArizaList({ arizalar, onSelect, onDelete, selectedArizaId, loadArizalar, setCurrentPage }) {
  const [loadingId, setLoadingId] = useState(null); // Silme sırasında yüklenen ID
  const [error, setError] = useState(null); // Hata mesajını tutar

  // Tarih formatlama fonksiyonu: Yıl-Ay-Gün => Gün.Ay.Yıl
  const formatDateToString = (date) => {
    if (!date) return '-';
    const [year, month, day] = date.split('-');
    return `${day}.${month}.${year}`;
  };

  const handleDelete = async (id) => {
    setLoadingId(id);
    setError(null);
    try {
      await onDelete(id);
    } catch (err) {
      setError(`Arıza silinirken hata oluştu: ${err.message || 'Bilinmeyen hata'}`);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="table-container">
      <div className='table-container-header'>
      <h2>Arızalar</h2>
      <button onClick={()=>{loadArizalar(); setCurrentPage(1)}}>Refresh</button>
      </div>
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
              <td
                onClick={() => onSelect(ariza.id === selectedArizaId ? null : ariza.id)}
                style={{
                  cursor: 'pointer',
                  color: '#007BFF',
                  textDecoration: 'underline',
                  fontWeight: ariza.id === selectedArizaId ? 'bold' : 'normal',
                }}
              >
                {ariza.id}
              </td>
              <td>{ariza.adres}</td>
              <td>{ariza.usta}</td>
              <td>{ariza.status}</td>
              <td>{ariza.ucret || '-'}</td>
              <td>{formatDateToString(ariza.tarih)}</td>
              <td>{ariza.detay || '-'}</td>
              <td>
                {ariza.dokuman ? (
                  ariza.dokuman.split(',').map((link, index) => (
                    <div key={index}>
                      <a
                        href={link.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#007BFF', textDecoration: 'underline' }}
                      >
                        {`Doküman ${index + 1}`}
                      </a>
                    </div>
                  ))
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
