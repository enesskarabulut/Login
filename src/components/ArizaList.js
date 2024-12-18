import React from 'react';

function ArizaList({ arizalar, onSelect, onDelete }) {
  return (
    <div className="table-container">
      <h2>Arızalar</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Adres</th>
            <th>Usta</th>
            <th>Status</th>
            <th>Ücret</th>
            <th>Tarih</th>
            <th>Detay</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {arizalar.map((ariza) => (
            <tr key={ariza.id}>
              <td onClick={() => onSelect(ariza.id)} style={{ cursor: 'pointer' }}>
                {ariza.id}
              </td>
              <td>{ariza.adres}</td>
              <td>{ariza.usta}</td>
              <td>{ariza.status}</td>
              <td>{ariza.ucret || '-'}</td>
              <td>{ariza.tarih || '-'}</td>
              <td>{ariza.detay || '-'}</td>
              <td>
                <button onClick={() => onDelete(ariza.id)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ArizaList;
