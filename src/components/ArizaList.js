import React, { useState } from 'react';

function ArizaList({
  arizalar,
  onSelect,
  onDelete,
  selectedArizaId,
  setCurrentPage,
  loadArizalar,
  loading
}) {
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(null);

  // Tarih formatlama fonksiyonu: Yıl-Ay-Gün => Gün.Ay.Yıl
  const formatDateToString = (date) => {
    if (!date) return '-';
    const [year, month, day] = date.split('-');
    return `${day}.${month}.${year}`;
  };

  const formatAddress = (ariza) => {
    const {
      mahalle = 'Mh.',
      sokak = 'SK',
      binaNo = 'B',
      daireNo = 'D',
      il = '-',
      ilce = '-',
    } = ariza;
    return `${mahalle} Mh., ${sokak} Sk., Bina No: ${binaNo}, Daire No: ${daireNo}, ${il}, ${ilce}`;
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
    <div style={styles.tableContainerOuter}>
      {/* Tablonun üstündeki başlık veya butonlar */}
      <div style={styles.tableHeader}>
        <h2 style={{margin:'0'}} >Arızalar</h2>
        <button
          onClick={() => {
            setCurrentPage(1);
            loadArizalar()
          }}
          style={styles.refreshButton}
        >
          Yenile
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{overflowX:'auto', width:'100%'}}>

      <table style={styles.table}>
        <thead >
          <tr>
            <th>ID</th>
            <th>Müşteri Bilgisi</th>
            <th>Telefon Numarası</th>
            <th>Adres</th>
            <th>Usta</th>
            <th>Statü</th>
            <th>Ücret</th>
            <th>Tarih</th>
            <th>Detay</th>
            <th>Dökümanlar</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {loading ? <p>Yükleniyor..</p> : arizalar.map((ariza) => (
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
              <td>
                {ariza.name && ariza.surname
                  ? `${ariza.name} ${ariza.surname}`
                  : '-'}
              </td>
              <td>{ariza.msisdn || '-'}</td>
              <td>{formatAddress(ariza)}</td>
              <td>{ariza.usta || '-'}</td>
              <td>{ariza.status || '-'}</td>
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
                    borderRadius: '4px',
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
    </div>
  );
}

const styles = {
  tableContainerOuter: {
    margin: '0 auto',
    marginBottom: '1em',
    maxWidth: '1200px',
    backgroundColor: '#fff',
    borderRadius: '6px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    padding: '0.5em',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5em',
    padding: '0 0.5em',
  },
  refreshButton: {
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    width:'unset',
    margin:'0'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
    overflowX: 'auto',

  },
};

export default ArizaList;
