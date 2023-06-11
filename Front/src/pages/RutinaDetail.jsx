import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

function RutinaDetail() {
  const [rutina, setRutina] = useState([]);
  const [ejercicios, setEjercicios] = useState([]);
  const params = useParams();
  const token = sessionStorage.getItem('jwtToken');

  useEffect(() => {
    if (!navigator.onLine) {
      if (localStorage.getItem("rutina"+params.rutinaId) === null) {
        setRutina([]);
      } else {
        setRutina(localStorage.getItem("rutina"+params.rutinaId));
      }
    }
    else {
    const URL = "http://localhost:2000/api/v1/rutinas/" + params.rutinaId;
    fetch(URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setRutina(data);
      });
  }}, [params.rutinaId]);

  useEffect(() => {
    if (!navigator.onLine) {
      if (localStorage.getItem("ejercicios") === null) {
        setEjercicios([]);
      } else {
        setEjercicios(localStorage.getItem("ejercicios"));
      }
    }
    else {
    const URL = "http://localhost:2000/api/v1/rutinas/" + params.rutinaId + "/ejercicios";
    fetch(URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setEjercicios(data);
      });
  }}, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        className="container"
        style={{
          backgroundColor: '#363636',
          padding: '16px',
          margin: '20px',
          width: '90vw',
        }}
      >
        <div className="row" style={{ width: '100%' }}>
          <div className="col-sm-3 d-flex align-items-center justify-content-center">
            <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}><FormattedMessage id="Tipo" /></h2>
          </div>
          <div className="col-sm-3 d-flex align-items-center justify-content-center">
            <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}><FormattedMessage id="Duracion" /></h2>
          </div>
          <div className="col-sm-3 d-flex align-items-center justify-content-center">
            <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}><FormattedMessage id="Repeticiones" /></h2>
          </div>
          <div className="col-sm-3 d-flex align-items-center justify-content-center">
            <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}><FormattedMessage id="Informacion" /></h2>
          </div>

        
          {ejercicios.map((ejercicio) => (
            <div className="row" key={ejercicio.id}>
              <div className="col-sm-3 d-flex align-items-center justify-content-center">
                <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 'lighter' }}>- {ejercicio.tipo}</h2>
              </div>
              <div className="col-sm-3 d-flex align-items-center justify-content-center">
                <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 'lighter' }}>{ejercicio.duracion}</h2>
              </div>
              <div className="col-sm-3 d-flex align-items-center justify-content-center">
                <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 'lighter' }}>{ejercicio.numRepeiciones}</h2>
              </div>
              <div className="col-sm-3 d-flex align-items-center justify-content-center">
                <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 'lighter' }}>{ejercicio.infoAdicional}</h2>
              </div>
            </div>
          ))}
      </div>
      </div>
      </div>
    
  );
}

export default RutinaDetail;

