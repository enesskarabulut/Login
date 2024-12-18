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
  };

  useEffect(() => {
    loadAriza();
    // eslint-disable-next-line
  }, [id]);

  const handleUpdate = async () => {
    const arizaData = { adres, usta, status, ucret: ucret ? Number(ucret) : null, detay };
    if (status === 'ileri tarihli') {
      arizaData.tarih = tarih;
    }
    await updateAriza(id, arizaData);
    loadAriza();
    loadArizalar();
  };

  const handleUpload = async () => {
    if (file) {
      await uploadDokuman(id, file);
      loadAriza();
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
        <input type="number" value={ucret} onChange={(e) => setUcret(e.target.value)} />
      </div>
      {status === 'ileri tarihli' && (
        <div>
          <label>Tarih:</label>
          <input type="date" value={tarih} onChange={(e) => setTarih(e.target.value)} />
        </div>
      )}
      <div>
        <label>Detay:</label>
        <textarea value={detay} onChange={(e) => setDetay(e.target.value)} rows="3" />
      </div>
      <button onClick={handleUpdate}>Güncelle</button>

      <hr />
      <h3>Doküman Yükle</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Yükle</button>

      <hr />
      <button onClick={onClose}>Kapat</button>
    </div>
  );
}

export default ArizaDetailPage;
