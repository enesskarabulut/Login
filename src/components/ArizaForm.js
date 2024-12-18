import React, { useState } from 'react';

function ArizaForm({ onCreate }) {
  const [adres, setAdres] = useState('');
  const [usta, setUsta] = useState('');
  const [status, setStatus] = useState('işleme alındı');
  const [ucret, setUcret] = useState('');
  const [tarih, setTarih] = useState('');
  const [detay, setDetay] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Yeni arıza verilerini oluştur
    const arizaData = {
      adres,
      usta,
      status,
      ucret: ucret ? Number(ucret) : null,
      detay,
      tarih: status === 'ileri tarihli' ? tarih : null,
    };

    onCreate(arizaData);

    // Formu sıfırla
    setAdres('');
    setUsta('');
    setStatus('işleme alındı');
    setUcret('');
    setTarih('');
    setDetay('');
  };

  return (
    <div className="card form-container">
      <h2>Yeni Arıza Oluştur</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Adres:</label>
          <input value={adres} onChange={(e) => setAdres(e.target.value)} required />
        </div>
        <div>
          <label>Usta:</label>
          <input value={usta} onChange={(e) => setUsta(e.target.value)} required />
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
            step="0.01"
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
              required
            />
          </div>
        )}
        <div>
          <label>Detay:</label>
          <textarea
            value={detay}
            onChange={(e) => setDetay(e.target.value)}
            rows={3}
          ></textarea>
        </div>
        <button type="submit">Kaydet</button>
      </form>
    </div>
  );
}

export default ArizaForm;
