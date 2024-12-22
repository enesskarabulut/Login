import React, { useState, useEffect } from 'react';
import { fetchArizaById, updateAriza } from '../api/api';
import antalyaData from '../data/antalya.json';

function ArizaDetailPage({ id, loadArizalar, onClose, onDetailLoaded }) {
  const [ariza, setAriza] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    msisdn: '',
    il: 'ANTALYA',
    ilce: '',
    mahalle: '',
    sokak: '',
    binaNo: '',
    daireNo: '',
    usta: '',
    status: '',
    ucret: '',
    tarih: '',
    detay: '',
  });
  const [file, setFile] = useState(null);
  const [dokumanlar, setDokumanlar] = useState([]);

  const ilceler = Object.keys(antalyaData['ANTALYA']);
  const mahalleler = formData.ilce ? antalyaData['ANTALYA'][formData.ilce] : [];

  const loadAriza = async () => {
    try {
      const { data } = await fetchArizaById(id);
      const arizaData = Array.isArray(data) ? data.find((item) => item.id === id) : data;
      if (arizaData) {
        setAriza(arizaData);
        setFormData({
          name: arizaData.name || '',
          surname: arizaData.surname || '',
          msisdn: arizaData.msisdn || '',
          il: arizaData.il || 'ANTALYA',
          ilce: arizaData.ilce || '',
          mahalle: arizaData.mahalle || '',
          sokak: arizaData.sokak || '',
          binaNo: arizaData.binaNo || '',
          daireNo: arizaData.daireNo || '',
          usta: arizaData.usta || '',
          status: arizaData.status || '',
          ucret: arizaData.ucret || '',
          tarih: arizaData.tarih || '',
          detay: arizaData.detay || '',
        });
        setDokumanlar(arizaData.dokuman ? arizaData.dokuman.split(',') : []);
      }
      if (onDetailLoaded) onDetailLoaded();
    } catch (error) {
      console.error('Arıza verisi yüklenirken hata oluştu:', error);
    }
  };

  useEffect(() => {
    loadAriza();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIlceChange = (e) => {
    setFormData((prev) => ({ ...prev, ilce: e.target.value, mahalle: '', sokak: '', binaNo: '', daireNo: '' }));
  };

  const handleMahalleChange = (e) => {
    setFormData((prev) => ({ ...prev, mahalle: e.target.value, sokak: '', binaNo: '', daireNo: '' }));
  };

  const handleUpdate = async () => {
    const arizaData = {
      ...formData,
      ucret: formData.ucret ? Number(formData.ucret) : null,
      tarih: formData.status === 'ileri tarihli' ? formData.tarih : null,
    };

    try {
      await updateAriza(id, arizaData);
      await loadAriza();
      loadArizalar();
    } catch (error) {
      console.error('Güncelleme hatası:', error);
    }
  };

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

        alert('Dosya başarıyla yüklendi!');
        loadAriza();
      } catch (error) {
        console.error('Dosya yükleme hatası:', error);
        alert('Dosya yüklenirken bir hata oluştu.');
      }
    };

    reader.readAsDataURL(file);
  };

  if (!ariza) return <div>Yükleniyor...</div>;

  return (
    <div className="detail-container">
      <h2>Arıza Detayı #{ariza.id}</h2>
      <div className="detail-form-grid">
        <div className="form-group">
          <label>Müşteri Adı:</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Müşteri Adı"
            required
          />
        </div>

        <div className="form-group">
          <label>Müşteri Soyadı:</label>
          <input
            name="surname"
            value={formData.surname}
            onChange={handleInputChange}
            placeholder="Müşteri Soyadı"
            required
          />
        </div>

        <div className="form-group">
          <label>Telefon Numarası:</label>
          <input
            name="msisdn"
            value={formData.msisdn}
            onChange={handleInputChange}
            placeholder="05XXXXXXXXX"
            pattern="05[0-9]{9}"
            required
          />
        </div>

        <div className="form-group">
          <label>İl:</label>
          <input value={formData.il} readOnly />
        </div>

        <div className="form-group">
          <label>İlçe:</label>
          <select name="ilce" value={formData.ilce} onChange={handleIlceChange} required>
            <option value="">-- İlçe Seçin --</option>
            {ilceler.map((ic) => (
              <option key={ic} value={ic}>{ic}</option>
            ))}
          </select>
        </div>

        {formData.ilce && (
          <div className="form-group">
            <label>Mahalle:</label>
            <select
              name="mahalle"
              value={formData.mahalle}
              onChange={handleMahalleChange}
              required
            >
              <option value="">-- Mahalle Seçin --</option>
              {mahalleler.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        )}

        {formData.mahalle && (
          <div className="form-group">
            <label>Sokak:</label>
            <input
              name="sokak"
              value={formData.sokak}
              onChange={handleInputChange}
              placeholder="Sokak"
              required
            />
          </div>
        )}

        {formData.mahalle && (
          <div className="form-group">
            <label>Bina No:</label>
            <input
              name="binaNo"
              value={formData.binaNo}
              onChange={handleInputChange}
              placeholder="Bina No"
              required
            />
          </div>
        )}

        {formData.mahalle && (
          <div className="form-group">
            <label>Daire No:</label>
            <input
              name="daireNo"
              value={formData.daireNo}
              onChange={handleInputChange}
              placeholder="Daire No"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Usta:</label>
          <input
            name="usta"
            value={formData.usta}
            onChange={handleInputChange}
            placeholder="Usta"
          />
        </div>

        <div className="form-group">
          <label>Durum:</label>
          <select name="status" value={formData.status} onChange={handleInputChange}>
            <option value="işleme alındı">işleme alındı</option>
            <option value="tamamlandı">tamamlandı</option>
            <option value="ertelendi">ertelendi</option>
            <option value="ileri tarihli">ileri tarihli</option>
          </select>
        </div>

        <div className="form-group">
          <label>Ücret:</label>
          <input
            type="number"
            name="ucret"
            value={formData.ucret}
            onChange={handleInputChange}
          />
        </div>

        {formData.status === 'ileri tarihli' && (
          <div className="form-group">
            <label>Tarih:</label>
            <input
              type="date"
              name="tarih"
              value={formData.tarih}
              onChange={handleInputChange}
            />
          </div>
        )}

        <div className="form-group full-width">
          <label>Detay:</label>
          <textarea
            name="detay"
            value={formData.detay}
            onChange={handleInputChange}
            rows="3"
          />
        </div>
      </div>

      <button onClick={handleUpdate} className="update-button" style={{ marginTop: '10px' }}>Güncelle</button>

      <hr />
      <h3>Doküman Yükle</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} style={{ marginTop: '10px' }}>Yükle</button>

      <h3>Yüklenen Dokümanlar</h3>
      {dokumanlar.length > 0 ? (
        <ul>
          {dokumanlar.map((doc, index) => (
            <li key={index}>
              <a href={doc.trim()} target="_blank" rel="noopener noreferrer" className="dokuman-link">
                {`Doküman ${index + 1}`}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>Henüz yüklenmiş bir doküman yok.</p>
      )}

      <hr />
      <button onClick={onClose} style={{ backgroundColor: '#6c757d', marginTop: '10px' }}>Kapat</button>
    </div>
  );
}

export default ArizaDetailPage;
