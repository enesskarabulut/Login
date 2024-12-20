import React, { useState } from 'react';

function ArizaForm({ onCreate }) {
  const [formData, setFormData] = useState({
    name: '', // Müşteri Adı
    surname: '', // Müşteri Soyadı
    msisdn: '', // Telefon Numarası
    adres: '',
    usta: '',
    status: 'işleme alındı',
    ucret: '',
    tarih: '',
    detay: '',
  });

  const [errors, setErrors] = useState({}); // Hata mesajlarını tutar

  // Input değişimini yönetir
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Telefon numarası doğrulama
    if (name === 'msisdn') {
      const phoneRegex = /^05\d{9}$/; // 05 ile başlayan toplam 11 karakterli numara
      if (!phoneRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          msisdn: 'Telefon numarası 05XXXXXXXXX formatında olmalıdır.',
        }));
      } else {
        const updatedErrors = { ...errors };
        delete updatedErrors.msisdn; // Hata yoksa kaldır
        setErrors(updatedErrors);
      }
    }
  };

  // Tarihi gün.ay.yıl formatına çevirir
  const formatTarih = (tarih) => {
    const date = new Date(tarih);
    const gun = String(date.getDate()).padStart(2, '0');
    const ay = String(date.getMonth() + 1).padStart(2, '0');
    const yil = date.getFullYear();
    return `${gun}.${ay}.${yil}`;
  };

  // Form submit edildiğinde çağrılır
  const handleSubmit = (e) => {
    e.preventDefault();

    // Telefon numarası formatı kontrolü
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
      adres: '',
      usta: '',
      status: 'işleme alındı',
      ucret: '',
      tarih: '',
      detay: '',
    });
    setErrors({});
  };

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

        {/* Adres */}
        <div>
          <label>Adres:</label>
          <input
            name="adres"
            value={formData.adres}
            onChange={handleChange}
            required
          />
        </div>

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
