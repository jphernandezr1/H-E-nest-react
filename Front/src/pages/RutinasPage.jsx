import React, { useEffect, useState } from "react";
import RutinaCard from "../components/RutinaCard";
import { FaSearch } from 'react-icons/fa';
import { FormattedMessage } from "react-intl";

function RutinasPage() {
  const [rutinas, setRutinas] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const token = sessionStorage.getItem('jwtToken');

  useEffect(() => {
    if (!navigator.onLine) {
      if (localStorage.getItem("rutina") === null) {
        setRutinas([]);
      } else {
        setRutinas(localStorage.getItem("rutina"));
      }

    }
    else {
    const URL = "http://localhost:2000/api/v1/rutinas/";
    fetch(URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setRutinas(data);
      });
  }}, []);

  const handleFiltroNombreChange = (event) => {
    setFiltroNombre(event.target.value);
  };

  const rutinasFiltradasOrdenadas=rutinas.filter((receta) =>
  receta.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
)

  const toggleOrden = () => {
    setOrdenAscendente(!ordenAscendente);
    if(ordenAscendente)
    {
      setRutinas([...rutinas]
      .sort((a, b) => a.nombre.localeCompare(b.nombre)));
    }
    else
    {
      setRutinas([...rutinas]
        .sort((b, a) => a.nombre.localeCompare(b.nombre)))
    }
    
  };

  

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          marginTop: '16px',
          width: '90vw',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ color: 'white', fontSize: '72px', fontWeight: 'bold', marginLeft: '12px' }}>
              <FormattedMessage id="Nuestras rutinas" />
            </h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder=""
                value={filtroNombre}
                onChange={handleFiltroNombreChange}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid white',
                  color: 'white',
                  fontSize: '16px',
                  padding: '8px',
                  paddingRight: '30px',
                  width: '100%',
                }}
              />
              <FaSearch
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                }}
              />
            </div>
            <button
              onClick={toggleOrden}
              style={{ width: 'auto', color: 'white', fontWeight: 'bold' }}
            >
              <FormattedMessage id="Ordenar por" /> {ordenAscendente ? <FormattedMessage id="Ascendente" /> :<FormattedMessage id="Descendente"/>}
            </button>
          </div>
        </div>
        {rutinasFiltradasOrdenadas.map((rutina) => (
          <RutinaCard key={rutina.id} rutina={rutina} />
        ))}
      </div>
    </div>
  );
}

export default RutinasPage;
