import React, { useState, useEffect } from 'react';
import { fetchArizaById, updateAriza, uploadDokuman } from '../api/api';

function ArizaDetailPage({ id, loadArizalar, onClose }) {
  const [ariza, setAriza] = useState(null);
  const [adres, setAdres] = useState('');
  const [usta, setUsta] = useState('');
  const [status, setStatus] = useState('');
  const [ucret, setUcret] = useState('');
  const [tarih, setTarih] = useState('');
  const [detay, setDetay] = useState('');
  const [file, setFile] = useState(null);
  const [dokumanlar, setDokumanlar] = useState([]); // Dokümanların listesi

  // Arıza verisini yükle
  const loadAriza = async () => {
    const { data } = await fetchArizaById(id);
    setAriza(data);
    setAdres(data.adres);
    setUsta(data.usta);
    setStatus(data.status);
    setUcret(data.ucret || '');
    setTarih(data.tarih || '');
    setDetay(data.detay || '');

    // Dokümanları kontrol edip liste formatına çevir
    const dokumanField = data.dokuman || '';
    setDokumanlar(dokumanField ? dokumanField.split(',') : []);
  };

  useEffect(() => {
    loadAriza();
  }, [id]);

  // Arıza güncelleme işlemi
  const handleUpdate = async () => {
    const arizaData = {
      adres,
      usta,
      status,
      ucret: ucret ? Number(ucret) : null,
      detay,
      tarih: status === 'ileri tarihli' ? tarih : null,
    };

    await updateAriza(id, arizaData);
    loadAriza();
    loadArizalar();
  };

  // Dosya yükleme işlemi
  const handleUpload = async () => {
    if (file) {
      try {
        const fileURL = await uploadDokuman(id, file);
        console.log('Yüklenen dosya URL:', fileURL);
        alert('Dosya başarıyla yüklendi!');
        loadAriza(); // Yeniden yükle
      } catch (error) {
        console.error('Dosya yükleme hatası:', error.message);
        alert('Dosya yüklenirken bir hata oluştu.');
      }
    }
  };

  if (!ariza) return <div>Yükleniyor...</div>;

  return (
    <div className="detail-container">
      <h2>Arıza Detayı #{ariza.id}</h2>
      <div>
        <label>Adres:</label>
        <input value={adres} onChange={(e) => setAdres(e.target.value)} />
      </div>
      <div>
        <label>Usta:</label>
        <input value={usta} onChange={(e) => setUsta(e.target.value)} />
      </div>
      <div>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="işleme alındı">işleme alındı</option>
          <option value="tamamlandı">tamamlandı</option>
          <option value="ertelendi">ertelendi</option>
          <option value="ileri tarihli">ileri tarihli</option>
        </select>
      </div>
      <div>
        <label>Ücret:</label>
        <input
          type="number"
          value={ucret}
          onChange={(e) => setUcret(e.target.value)}
        />
      </div>
      {status === 'ileri tarihli' && (
        <div>
          <label>Tarih:</label>
          <input
            type="date"
            value={tarih}
            onChange={(e) => setTarih(e.target.value)}
          />
        </div>
      )}
      <div>
        <label>Detay:</label>
        <textarea
          value={detay}
          onChange={(e) => setDetay(e.target.value)}
          rows="3"
        />
      </div>
      <button onClick={handleUpdate}>Güncelle</button>

      <hr />
      <h3>Doküman Yükle</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Yükle</button>

      <h3>Yüklenen Dokümanlar</h3>
      {dokumanlar.length > 0 ? (
        <ul>
          {dokumanlar.map((doc, index) => (
            <li key={index}>
              <a
                href={doc.trim()} // Boşluk temizleniyor
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#007BFF', textDecoration: 'underline' }}
              >
                {`Doküman ${index + 1}`}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>Henüz yüklenmiş bir doküman yok.</p>
      )}

      <hr />
      <button onClick={onClose}>Kapat</button>
    </div>
  );
}

export default ArizaDetailPage;
