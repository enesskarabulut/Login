import React, { useState, useEffect } from 'react';
import { fetchArizaById, updateAriza } from '../api/api';

function ArizaDetailPage({ id, loadArizalar, onClose, onDetailLoaded }) {
  const [ariza, setAriza] = useState(null);
  const [adres, setAdres] = useState('');
  const [usta, setUsta] = useState('');
  const [status, setStatus] = useState('');
  const [ucret, setUcret] = useState('');
  const [tarih, setTarih] = useState('');
  const [detay, setDetay] = useState('');
  const [file, setFile] = useState(null);
  const [dokumanlar, setDokumanlar] = useState([]);

  // Arıza verisini yükle
  const loadAriza = async () => {
    try {
      const { data } = await fetchArizaById(id);
      setAriza(data);
      setAdres(data.adres);
      setUsta(data.usta);
      setStatus(data.status);
      setUcret(data.ucret || '');
      setTarih(data.tarih || '');
      setDetay(data.detay || '');

      const dokumanField = data.dokuman || '';
      setDokumanlar(dokumanField ? dokumanField.split(',') : []);

      // Detay yüklendiğini parent component'e bildir
      if (onDetailLoaded) onDetailLoaded();
    } catch (error) {
      console.error('Arıza verisi yüklenirken hata oluştu:', error.message);
    }
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

  const handleUpload = () => {
    if (!file) return;
  
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result.split(',')[1]; // Base64 verisini al
      const token = localStorage.getItem('token'); // Token'ı localStorage'den al
  
      try {
        const response = await fetch(`/api/arizalar?id=${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Token'ı ekle
          },
          body: JSON.stringify({ file: { name: file.name, content: base64Data } }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Yükleme başarısız');
        }
  
        const responseData = await response.json();
        console.log('Yüklenen dosya URL:', responseData.dokumanURL);
        alert('Dosya başarıyla yüklendi!');
        loadAriza(); // Arıza verisini tekrar yükle
      } catch (error) {
        console.error('Dosya yükleme hatası:', error.message);
        alert('Dosya yüklenirken bir hata oluştu.');
      }
    };
  
    reader.readAsDataURL(file); // Dosyayı Base64'e çevir
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
                href={doc.trim()}
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
