import React, { useState } from 'react';

function ArizaList({
  arizalar,
  onSelect,
  onDelete,
  selectedArizaId,
  loadArizalar,
  setCurrentPage,
}) {
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
      {/* Header Bölümü */}
      <div className="table-container-header">
        <h2>Arızalar</h2>
        <button
          onClick={() => {
            loadArizalar();
            setCurrentPage(1);
          }}
        >
          Refresh
        </button>
      </div>

      {/* Hata Mesajı */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Arızalar Tablosu */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Müşteri Bilgisi</th>
            <th>Telefon Numarası</th>
            <th>İl</th>
            <th>İlçe</th>
            <th>Mahalle</th>
            <th>Bina No</th>
            <th>Daire No</th>
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
              {/* ID */}
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

              {/* Müşteri Bilgisi */}
              <td>
                {ariza.name && ariza.surname
                  ? `${ariza.name} ${ariza.surname}`
                  : '-'}
              </td>

              {/* Telefon Numarası */}
              <td>{ariza.msisdn || '-'}</td>

              {/* İl */}
              <td>{ariza.il || '-'}</td>

              {/* İlçe */}
              <td>{ariza.ilce || '-'}</td>

              {/* Mahalle */}
              <td>{ariza.mahalle || '-'}</td>

              {/* Bina No */}
              <td>{ariza.binaNo || '-'}</td>

              {/* Daire No */}
              <td>{ariza.daireNo || '-'}</td>

              {/* Usta */}
              <td>{ariza.usta}</td>

              {/* Status */}
              <td>{ariza.status}</td>

              {/* Ücret */}
              <td>{ariza.ucret || '-'}</td>

              {/* Tarih */}
              <td>{formatDateToString(ariza.tarih)}</td>

              {/* Detay */}
              <td>{ariza.detay || '-'}</td>

              {/* Dökümanlar */}
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

              {/* Silme Butonu */}
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
