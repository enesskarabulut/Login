import React, { useState } from 'react';

function ArizaForm({ onCreate, onUpload }) {
  const [formData, setFormData] = useState({
    adres: '',
    usta: '',
    status: 'işleme alındı',
    ucret: '',
    tarih: '',
    detay: '',
  });

  const [file, setFile] = useState(null); // Dosya state'i

  // Input değişimini yönetir
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Tarihi gün.ay.yıl formatına çevirir
  const formatTarih = (tarih) => {
    const date = new Date(tarih);
    const gun = String(date.getDate()).padStart(2, '0'); // Gün (2 basamaklı)
    const ay = String(date.getMonth() + 1).padStart(2, '0'); // Ay (0 tabanlı olduğu için +1)
    const yil = date.getFullYear(); // Yıl
    return `${gun}.${ay}.${yil}`; // Formatlanmış tarih
  };

  // Form submit edildiğinde çağrılır
  const handleSubmit = (e) => {
    e.preventDefault();

    const arizaData = {
      ...formData,
      ucret: formData.ucret ? Number(formData.ucret) : null,
      tarih:
        formData.status === 'ileri tarihli' && formData.tarih
          ? formatTarih(formData.tarih)
          : null, // Formatlanmış tarih
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

  // Dosya seçimini yönetir
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Dosyayı yükleme işlemi
  const handleUpload = async () => {
    if (file) {
      try {
        await onUpload(file);
        alert('Dosya başarıyla yüklendi!');
        setFile(null); // Dosya state'ini sıfırla
      } catch (error) {
        console.error('Dosya yükleme hatası:', error.message);
        alert('Dosya yüklenirken bir hata oluştu.');
      }
    } else {
      alert('Lütfen bir dosya seçin.');
    }
  };

  return (
    <div className="card form-container">
      <h2>Yeni Arıza Oluştur</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Adres:</label>
          <input
            name="adres"
            value={formData.adres}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Usta:</label>
          <input
            name="usta"
            value={formData.usta}
            onChange={handleChange}
            required
          />
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

        {/* Döküman yükleme alanı */}
        <div>
          <label>Döküman Yükle:</label>
          <input type="file" onChange={handleFileChange} />
          <button type="button" onClick={handleUpload}>
            Döküman Yükle
          </button>
        </div>

        <button type="submit">Kaydet</button>
      </form>
    </div>
  );
}

export default ArizaForm;
