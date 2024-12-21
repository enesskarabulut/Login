import React, { useState } from 'react';
import antalyaData from '../data/antalya.json'; // JSON dosyanızın konumuna göre düzenleyin

function ArizaForm({ onCreate }) {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    msisdn: '',
    il: 'ANTALYA', 
    ilce: '',
    mahalle: '',
    sokak: '', // Yeni alan: Sokak No
    binaNo: '',
    daireNo: '',
    usta: '',
    status: 'işleme alındı',
    ucret: '',
    tarih: '',
    detay: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'ilce') {
      // ilçe değişince mahalle, sokak, binaNo, daireNo sıfırlanır
      setFormData((prev) => ({
        ...prev,
        ilce: value,
        mahalle: '',
        sokak: '',
        binaNo: '',
        daireNo: '',
      }));
    } else if (name === 'mahalle') {
      setFormData((prev) => ({
        ...prev,
        mahalle: value,
        sokak: '',
        binaNo: '',
        daireNo: '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Telefon numarası doğrulama
    if (name === 'msisdn') {
      const phoneRegex = /^05\d{9}$/;
      if (!phoneRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          msisdn: 'Telefon numarası 05XXXXXXXXX formatında olmalıdır.',
        }));
      } else {
        const updatedErrors = { ...errors };
        delete updatedErrors.msisdn;
        setErrors(updatedErrors);
      }
    }
  };

  const formatTarih = (tarih) => {
    const date = new Date(tarih);
    const gun = String(date.getDate()).padStart(2, '0');
    const ay = String(date.getMonth() + 1).padStart(2, '0');
    const yil = date.getFullYear();
    return `${gun}.${ay}.${yil}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const phoneRegex = /^05\d{9}$/;
    if (!phoneRegex.test(formData.msisdn)) {
      setErrors({ msisdn: 'Telefon numarası 05XXXXXXXXX formatında olmalıdır.' });
      return;
    }

    const arizaData = {
      ...formData,
      ucret: formData.ucret ? Number(formData.ucret) : null,
      tarih:
        formData.status === 'ileri tarihli' && formData.tarih
          ? formatTarih(formData.tarih)
          : null,
    };

    onCreate(arizaData);

    // Formu sıfırla
    setFormData({
      name: '',
      surname: '',
      msisdn: '',
      il: 'ANTALYA',
      ilce: '',
      mahalle: '',
      sokak: '', // Sokak No sıfırlama
      binaNo: '',
      daireNo: '',
      usta: '',
      status: 'işleme alındı',
      ucret: '',
      tarih: '',
      detay: '',
    });
    setErrors({});
  };

  // antalyaData içinden ilçeleri çek
  const ilceler = Object.keys(antalyaData["ANTALYA"]);

  // Seçilen ilçenin mahallelerini çek
  const mahalleler = formData.ilce
    ? antalyaData["ANTALYA"][formData.ilce]
    : [];

  return (
    <div className="card form-container">
      <h2>Yeni Arıza Oluştur</h2>
      <form onSubmit={handleSubmit}>
        {/* Müşteri Adı */}
        <div>
          <label>Müşteri Adı:</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Müşteri Soyadı */}
        <div>
          <label>Müşteri Soyadı:</label>
          <input
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
          />
        </div>

        {/* Telefon Numarası */}
        <div>
          <label>Telefon Numarası:</label>
          <input
            name="msisdn"
            type="tel"
            value={formData.msisdn}
            onChange={handleChange}
            placeholder="05XXXXXXXXX"
            required
          />
          {errors.msisdn && <p style={{ color: 'red' }}>{errors.msisdn}</p>}
        </div>

        {/* İl */}
        <div>
          <label>İl:</label>
          <input
            name="il"
            value={formData.il}
            readOnly
          />
        </div>

        {/* İlçe */}
        <div>
          <label>İlçe:</label>
          <select
            name="ilce"
            value={formData.ilce}
            onChange={handleChange}
            required
          >
            <option value="">-- İlçe Seçin --</option>
            {ilceler.map((ilce) => (
              <option key={ilce} value={ilce}>{ilce}</option>
            ))}
          </select>
        </div>

        {/* Mahalle */}
        {formData.ilce && (
          <div>
            <label>Mahalle:</label>
            <select
              name="mahalle"
              value={formData.mahalle}
              onChange={handleChange}
              required
            >
              <option value="">-- Mahalle Seçin --</option>
              {mahalleler.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        )}

        {/* Sokak No */}
        {formData.mahalle && (
          <div>
            <label>Sokak No:</label>
            <input
              name="sokak"
              value={formData.sokak}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* Bina No ve Daire No */}
        {formData.mahalle && (
          <>
            <div>
              <label>Bina No:</label>
              <input
                name="binaNo"
                value={formData.binaNo}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Daire/Kapı No:</label>
              <input
                name="daireNo"
                value={formData.daireNo}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        {/* Usta */}
        <div>
          <label>Usta:</label>
          <input
            name="usta"
            value={formData.usta}
            onChange={handleChange}
            required
          />
        </div>

        {/* Status */}
        <div>
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
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
            name="ucret"
            type="number"
            step="0.01"
            value={formData.ucret}
            onChange={handleChange}
          />
        </div>

        {/* Tarih */}
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

        {/* Detay */}
        <div>
          <label>Detay:</label>
          <textarea
            name="detay"
            value={formData.detay}
            onChange={handleChange}
            rows={3}
          ></textarea>
        </div>

        {/* Kaydet Butonu */}
        <button type="submit" disabled={Object.keys(errors).length > 0}>
          Kaydet
        </button>
      </form>
    </div>
  );
}

export default ArizaForm;
