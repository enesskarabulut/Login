import React, { useState } from 'react';

function ArizaForm({ onCreate }) {
  const [formData, setFormData] = useState({
    adres: '',
    usta: '',
    status: 'işleme alındı',
    ucret: '',
    tarih: '',
    detay: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const arizaData = {
      ...formData,
      ucret: formData.ucret ? Number(formData.ucret) : null,
      tarih: formData.status === 'ileri tarihli' ? formData.tarih : null,
    };

    onCreate(arizaData);

    // Formu sıfırla
    setFormData({
      adres: '',
      usta: '',
      status: 'işleme alındı',
      ucret: '',
      tarih: '',
      detay: '',
    });
  };

  return (
    <div className="card form-container">
      <h2>Yeni Arıza Oluştur</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Adres:</label>
          <input name="adres" value={formData.adres} onChange={handleChange} required />
        </div>
        <div>
          <label>Usta:</label>
          <input name="usta" value={formData.usta} onChange={handleChange} required />
        </div>
        <div>
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="işleme alındı">işleme alındı</option>
            <option value="tamamlandı">tamamlandı</option>
            <option value="ertelendi">ertelendi</option>
            <option value="ileri tarihli">ileri tarihli</option>
          </select>
        </div>
        <div>
          <label>Ücret:</label>
          <input
            name="ucret"
            type="number"
            step="0.01"
            value={formData.ucret}
            onChange={handleChange}
          />
        </div>
        {formData.status === 'ileri tarihli' && (
          <div>
            <label>Tarih:</label>
            <input
              name="tarih"
              type="date"
              value={formData.tarih}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div>
          <label>Detay:</label>
          <textarea
            name="detay"
            value={formData.detay}
            onChange={handleChange}
            rows={3}
          ></textarea>
        </div>
        <button type="submit">Kaydet</button>
      </form>
    </div>
  );
}

export default ArizaForm;