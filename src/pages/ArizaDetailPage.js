import React, { useState, useEffect } from 'react';
import { fetchArizaById, updateAriza } from '../api/api';

function ArizaDetailPage({ id, loadArizalar, onClose, onDetailLoaded }) {
  const [ariza, setAriza] = useState(null);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [msisdn, setMsisdn] = useState('');
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
      setName(data.name || '');
      setSurname(data.surname || '');
      setMsisdn(data.msisdn || '');
      setAdres(data.adres || '');
      setUsta(data.usta || '');
      setStatus(data.status || '');
      setUcret(data.ucret || '');
      setTarih(data.tarih || '');
      setDetay(data.detay || '');

      const dokumanField = data.dokuman || '';
      setDokumanlar(dokumanField ? dokumanField.split(',') : []);

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
      name,
      surname,
      msisdn,
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
  const handleUpload = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result.split(',')[1];
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`/api/arizalar?id=${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
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
        loadAriza();
      } catch (error) {
        console.error('Dosya yükleme hatası:', error.message);
        alert('Dosya yüklenirken bir hata oluştu.');
      }
    };

    reader.readAsDataURL(file);
  };

  if (!ariza) return <div>Yükleniyor...</div>;

  return (
    <div className="detail-container">
      <h2>Arıza Detayı #{ariza.id}</h2>

      {/* Müşteri Adı */}
      <div>
        <label>Müşteri Adı:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Müşteri Adı"
          required
        />
      </div>

      {/* Müşteri Soyadı */}
      <div>
        <label>Müşteri Soyadı:</label>
        <input
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          placeholder="Müşteri Soyadı"
          required
        />
      </div>

      {/* Telefon Numarası */}
      <div>
        <label>Telefon Numarası:</label>
        <input
          value={msisdn}
          onChange={(e) => setMsisdn(e.target.value)}
          placeholder="05XXXXXXXXX"
          pattern="05[0-9]{9}"
          required
        />
      </div>

      {/* Adres */}
      <div>
        <label>Adres:</label>
        <input value={adres} onChange={(e) => setAdres(e.target.value)} />
      </div>

      {/* Usta */}
      <div>
        <label>Usta:</label>
        <input value={usta} onChange={(e) => setUsta(e.target.value)} />
      </div>

      {/* Status */}
      <div>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="işleme alındı">işleme alındı</option>
          <option value="tamamlandı">tamamlandı</option>
          <option value="ertelendi">ertelendi</option>
          <option value="ileri tarihli">ileri tarihli</option>
        </select>
      </div>

      {/* Ücret */}
      <div>
        <label>Ücret:</label>
        <input
          type="number"
          value={ucret}
          onChange={(e) => setUcret(e.target.value)}
        />
      </div>

      {/* Tarih */}
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

      {/* Detay */}
      <div>
        <label>Detay:</label>
        <textarea
          value={detay}
          onChange={(e) => setDetay(e.target.value)}
          rows="3"
        />
      </div>

      <button onClick={handleUpdate}>Güncelle</button>

      {/* Doküman Yükleme */}
      <hr />
      <h3>Doküman Yükle</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Yükle</button>

      {/* Yüklenen Dokümanlar */}
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
