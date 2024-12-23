import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../styles/ArizaMap.css';


// Varsayılan Marker İkonunu Düzenleyin
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Geocoding API ile Koordinatları Almak
const fetchCoordinates = async (address) => {
  if (!address || address.trim() === '') {
    console.error('Geçersiz adres:', address);
    return null;
  }

  try {
    console.log('Geocoding için gönderilen adres:', address);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );

    console.log('API çağrısı tamamlandı. Status:', response.status);

    if (!response.ok) {
      console.error(`Geocoding API hatası: ${response.status}`);
      return null;
    }

    const data = await response.json();

    console.log('Geocoding API yanıtı:', data);

    if (data && data.length > 0) {
      const coordinates = {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
      console.log('Bulunan koordinatlar:', coordinates);
      return coordinates;
    }

    console.warn('Koordinatlar bulunamadı:', address);
    return null;
  } catch (error) {
    console.error('Geocoding hatası:', error.message);
    return null;
  }
};

function ArizaMap({ arizalar }) {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const getCoordinates = async () => {
      try {
        const coordinates = await Promise.all(
          arizalar
            .filter((ariza) => ariza.status !== 'tamamlandı' && ariza.status !== 'iptal') // Statüye göre filtrele
            .map(async (ariza) => {
              console.log('Filtrelenmiş Arıza Bilgisi:', ariza);

              if (!ariza.mahalle || !ariza.ilce || !ariza.il) {
                console.warn('Eksik adres bilgisi:', ariza);
                return null; // Eksik adresi atla
              }

              const address = `${ariza.mahalle}, ${ariza.ilce}, ${ariza.il}`;
              const coord = await fetchCoordinates(address);

              if (coord) {
                return {
                  id: ariza.id,
                  ...coord,
                  usta: ariza.usta,
                  detay: ariza.detay,
                  status: ariza.status,
                };
              }
              console.warn('Koordinat bulunamadı:', address);
              return null;
            })
        );

        const validMarkers = coordinates.filter((marker) => marker !== null);
        setMarkers(validMarkers);
      } catch (error) {
        console.error('Koordinatlar yüklenirken hata oluştu:', error.message);
      }
    };

    if (arizalar.length > 0) {
      getCoordinates();
    }
  }, [arizalar]);

  return (
    <MapContainer center={[36.9, 30.7]} zoom={9} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {markers.map((marker) => (
        <Marker key={marker.id} position={[marker.latitude, marker.longitude]}>
          <Popup>
            <div>
              <strong>Usta:</strong> {marker.usta} <br />
              <strong>Arıza ID:</strong> {marker.id} <br />
              <strong>Detay:</strong> {marker.detay || 'Belirtilmemiş'} <br />
              <strong>Status:</strong> {marker.status || 'Belirtilmemiş'}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default ArizaMap;
