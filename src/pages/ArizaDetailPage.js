import React, { useState, useEffect } from 'react';
import { fetchArizaById, updateAriza } from '../api/api';
import antalyaData from '../data/antalya.json';

function ArizaDetailPage({ id, loadArizalar, onClose, onDetailLoaded }) {
  // Arıza verisini ve form alanlarını tutacak state'ler
  const [ariza, setAriza] = useState(null);

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [msisdn, setMsisdn] = useState('');
  const [il, setIl] = useState('');
  const [ilce, setIlce] = useState('');
  const [mahalle, setMahalle] = useState('');
  const [sokak, setSokak] = useState('');
  const [binaNo, setBinaNo] = useState('');
  const [daireNo, setDaireNo] = useState('');
  const [usta, setUsta] = useState('');
  const [status, setStatus] = useState('');
  const [ucret, setUcret] = useState('');
  const [tarih, setTarih] = useState('');
  const [detay, setDetay] = useState('');
  const [file, setFile] = useState(null);
  const [dokumanlar, setDokumanlar] = useState([]);

  // Antalya verilerinden ilçe ve mahalle listesini oluşturma
  // Not: Şu an "ANTALYA" varsayıyoruz. Gerekirse il seçimini de dinamik yapabilirsiniz.
  const ilceler = antalyaData["ANTALYA"] ? Object.keys(antalyaData["ANTALYA"]) : [];
  const mahalleler = ilce && antalyaData["ANTALYA"][ilce]
    ? antalyaData["ANTALYA"][ilce]
    : [];

  // Arıza verisini API'den çeken fonksiyon
  const loadAriza = async () => {
    try {
      const { data } = await fetchArizaById(id);

      // API'den dönen veri [ {...} ] şeklindeyse ilk elemanı alıyoruz:
      if (Array.isArray(data) && data.length > 0) {
        const arizaData = data[0]; 
        setAriza(arizaData);

        // Form alanlarını API’den dönen verilerle doldur
        setName(arizaData.name || '');
        setSurname(arizaData.surname || '');
        setMsisdn(arizaData.msisdn || '');
        // İl verisi null/boş ise varsayılan "ANTALYA" atayabilirsiniz:
        setIl(arizaData.il || 'ANTALYA');
        setIlce(arizaData.ilce || '');
        setMahalle(arizaData.mahalle || '');
        setSokak(arizaData.sokak || '');
        setBinaNo(arizaData.binaNo || '');
        setDaireNo(arizaData.daireNo || '');
        setUsta(arizaData.usta || '');
        setStatus(arizaData.status || '');
        setUcret(arizaData.ucret !== null ? arizaData.ucret : '');
        setTarih(arizaData.tarih || '');
        setDetay(arizaData.detay || '');

        // Doküman varsa virgülle ayrılmış linkleri dizi haline getir
        const dokumanField = arizaData.dokuman || '';
        setDokumanlar(dokumanField ? dokumanField.split(',') : []);
      }
      // Eğer API'niz doğrudan bir obje döndürüyorsa:
      // const arizaData = data;
      // setAriza(arizaData);
      // ... (aşağıdaki set'leri arizaData ile yapın)

      if (onDetailLoaded) onDetailLoaded();
    } catch (error) {
      console.error('Arıza verisi yüklenirken hata oluştu:', error.message);
    }
  };

  // Bileşen ilk yüklendiğinde veya "id" değiştiğinde arıza verisini yükleyelim
  useEffect(() => {
    loadAriza();
    // eslint-disable-next-line
  }, [id]);

  // İlçe seçilince mahalleyi, sokak, bina, daire alanlarını sıfırla
  const handleIlceChange = (e) => {
    const selectedIlce = e.target.value;
    setIlce(selectedIlce);
    setMahalle('');
    setSokak('');
    setBinaNo('');
    setDaireNo('');
  };

  // Mahalle seçilince sokak, bina, daireyi sıfırla
  const handleMahalleChange = (e) => {
    const selectedMahalle = e.target.value;
    setMahalle(selectedMahalle);
    setSokak('');
    setBinaNo('');
    setDaireNo('');
  };

  // Güncelle butonuna tıklanınca API'ye PATCH/PUT isteği
  const handleUpdate = async () => {
    const arizaData = {
      name,
      surname,
      msisdn,
      il,
      ilce,
      mahalle,
      sokak,
      binaNo,
      daireNo,
      usta,
      status,
      // Boş gönderilirse API hata verebilir diye null veya sayı çeviriyoruz
      ucret: ucret ? Number(ucret) : null,
      detay,
      tarih: status === 'ileri tarihli' ? tarih : null,
    };

    try {
      await updateAriza(id, arizaData);
      // Güncel veriyi tekrar yükle
      loadAriza();
      // Listeyi de güncellemek istiyorsanız
      loadArizalar();
    } catch (error) {
      console.error('Güncelleme hatası:', error.message);
    }
  };

  // Dosya yükleme işlemi
  const handleUpload = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result.split(',')[1];
      const token = localStorage.getItem('token'); // Token varsa

      try {
        const response = await fetch(`/api/arizalar?id=${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            file: {
              name: file.name,
              content: base64Data,
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Yükleme başarısız');
        }

        alert('Dosya başarıyla yüklendi!');
        // Güncel doküman listesini görmek için veriyi tekrar yükleyelim
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
      <div className="detail-form-grid">
        {/* Müşteri Adı */}
        <div className="form-group">
          <label>Müşteri Adı:</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Müşteri Adı"
            required
          />
        </div>

        {/* Müşteri Soyadı */}
        <div className="form-group">
          <label>Müşteri Soyadı:</label>
          <input
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            placeholder="Müşteri Soyadı"
            required
          />
        </div>

        {/* Telefon Numarası */}
        <div className="form-group">
          <label>Telefon Numarası:</label>
          <input
            value={msisdn}
            onChange={(e) => setMsisdn(e.target.value)}
            placeholder="05XXXXXXXXX"
            pattern="05[0-9]{9}"
            required
          />
        </div>

        {/* İl (Sabit: ANTALYA ya da API'den gelen) */}
        <div className="form-group">
          <label>İl:</label>
          <input
            value={il}
            onChange={(e) => setIl(e.target.value)}
            placeholder="İl"
            readOnly
          />
        </div>

        {/* İlçe */}
        <div className="form-group">
          <label>İlçe:</label>
          <select
            value={ilce}
            onChange={handleIlceChange}
            required
          >
            <option value="">-- İlçe Seçin --</option>
            {ilceler.map((ic) => (
              <option key={ic} value={ic}>
                {ic}
              </option>
            ))}
          </select>
        </div>

        {/* Mahalle */}
        {ilce && (
          <div className="form-group">
            <label>Mahalle:</label>
            <select
              value={mahalle}
              onChange={handleMahalleChange}
              required
            >
              <option value="">-- Mahalle Seçin --</option>
              {mahalleler.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sokak */}
        {mahalle && (
          <div className="form-group">
            <label>Sokak No:</label>
            <input
              value={sokak}
              onChange={(e) => setSokak(e.target.value)}
              placeholder="Sokak No"
              required
            />
          </div>
        )}

        {/* Bina No */}
        {mahalle && (
          <div className="form-group">
            <label>Bina No:</label>
            <input
              value={binaNo}
              onChange={(e) => setBinaNo(e.target.value)}
              placeholder="Bina No"
              required
            />
          </div>
        )}

        {/* Daire No */}
        {mahalle && (
          <div className="form-group">
            <label>Daire No:</label>
            <input
              value={daireNo}
              onChange={(e) => setDaireNo(e.target.value)}
              placeholder="Daire No"
              required
            />
          </div>
        )}

        {/* Usta */}
        <div className="form-group">
          <label>Usta:</label>
          <input
            value={usta}
            onChange={(e) => setUsta(e.target.value)}
          />
        </div>

        {/* Status */}
        <div className="form-group">
          <label>Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="işleme alındı">işleme alındı</option>
            <option value="tamamlandı">tamamlandı</option>
            <option value="ertelendi">ertelendi</option>
            <option value="ileri tarihli">ileri tarihli</option>
          </select>
        </div>

        {/* Ücret */}
        <div className="form-group">
          <label>Ücret:</label>
          <input
            type="number"
            value={ucret}
            onChange={(e) => setUcret(e.target.value)}
          />
        </div>

        {/* İleri tarihli ise Tarih alanı */}
        {status === 'ileri tarihli' && (
          <div className="form-group">
            <label>Tarih:</label>
            <input
              type="date"
              value={tarih || ''}
              onChange={(e) => setTarih(e.target.value)}
            />
          </div>
        )}

        {/* Detay */}
        <div className="form-group full-width">
          <label>Detay:</label>
          <textarea
            value={detay}
            onChange={(e) => setDetay(e.target.value)}
            rows="3"
          />
        </div>
      </div>

      {/* Güncelle Butonu */}
      <button onClick={handleUpdate} className="update-button" style={{ marginTop: '10px' }}>
        Güncelle
      </button>

      <hr />

      {/* Doküman Yükleme */}
      <h3>Doküman Yükle</h3>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload} style={{ marginTop: '10px' }}>
        Yükle
      </button>

      <h3>Yüklenen Dokümanlar</h3>
      {dokumanlar.length > 0 ? (
        <ul>
          {dokumanlar.map((doc, index) => (
            <li key={index}>
              <a
                href={doc.trim()}
                target="_blank"
                rel="noopener noreferrer"
                className="dokuman-link"
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
      <button onClick={onClose} style={{ backgroundColor: '#6c757d', marginTop: '10px' }}>
        Kapat
      </button>
    </div>
  );
}

export default ArizaDetailPage;
