import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import IngredienteCard from "../components/IngredienteCard";
import { FormattedMessage } from "react-intl";

function RecetaDetail() {
  const [receta, setReceta] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const params = useParams();
  const token = sessionStorage.getItem('jwtToken');

  useEffect(() => {
    if (!navigator.onLine) {
      if (localStorage.getItem("receta"+params.recetaId) === null) {
        setReceta([]);
      } else {
        setReceta(localStorage.getItem("receta"+params.recetaId));
      }
      if (localStorage.getItem("ingredientes"+params.recetaId) === null) {
        setIngredientes([]);
      } else {
        setIngredientes(localStorage.getItem("ingredientes"+params.recetaId));
      }
    }

    else {
    const URL = "http://localhost:2000/api/v1/recetas/" + params.recetaId;
    
    fetch(URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((data) => data.json())
      .then((data) => {
        setReceta(data);
        localStorage.setItem("receta"+params.recetaId, data);
      });

    const URL2 = "http://localhost:2000/api/v1/cantidades/recetas/" + params.recetaId + "/ingredientes";

    fetch(URL2, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((data) => data.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setIngredientes(data);
          localStorage.setItem("ingredientes"+params.recetaId, data);
        }
      });
    }
  }, []);
  

  return (
    <div style={{ margin: '0px 80px 0px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '62px', fontWeight: 'bold' }}>
          {receta.nombre}
        </h1>
      </div>
      <div className="row" style={{ marginTop: '20px', marginBottom: '20px', justifyContent: 'center' }}>
        <div className="col-8">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#272727',
              padding: '40px',
              margin: '0px 40px 0px 0px',
              borderRadius: 4,
            }}
          >
            <h2
              style={{
                color: 'white',
                fontSize: '32px',
                fontWeight: 'bold',
                marginLeft: '12px',
              }}
            >
              {receta.descripcion}
            </h2>
          </div>
        </div>
        <div className="col-4">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FF8C00',
              paddingBottom: '10px',
              borderRadius: 4,
            }}
          >
            <div
              className="d-flex flex-column"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <h2
                style={{
                  color: 'white',
                  fontSize: '60px',
                  fontWeight: 'bold',
                }}
              >
                {receta.calTotales}
              </h2>
              <h2
                style={{
                  color: 'white',
                  fontSize: '32px',
                  fontWeight: 'bold',
                }}
              >
                <FormattedMessage id="Calories"/>
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div style={{marginBottom: '20px'}}>
        <h2
          style={{ 
            color: 'white',
            fontSize: '32px',
            fontWeight: 'bold',
          }}
        >
          <FormattedMessage id="Ingredients"/>
        </h2>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'left' }}>
        {ingredientes?.map((ingrediente) => (
          <IngredienteCard key={ingrediente.id} ingrediente={ingrediente}/>
        ))}
      </div>
      <div style={{marginBottom: '20px'}}>
        <h2
          style={{ 
            color: 'white',
            fontSize: '32px',
            fontWeight: 'bold',
          }}
        >
          <FormattedMessage id="Preparation"/>
        </h2>
      </div>
      <div className="col-12">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#272727',
              padding: '40px',
              borderRadius: 4,
            }}
          >
            <h2
              style={{
                color: 'white',
                fontSize: '32px',
                fontWeight: 'bold',
                marginLeft: '12px',
              }}
            >
              {receta.especificaciones}
            </h2>
          </div>
        </div>
      <div style={{marginBottom: '20px', marginTop: '20px'}}>
        <h2
          style={{ 
            color: 'white',
            fontSize: '32px',
            fontWeight: 'bold',
          }}
        >
          <FormattedMessage id="AdditionalInfo"/>
        </h2>
      </div>
      <div className="col-12">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#272727',
              padding: '40px',
              borderRadius: 4,
            }}
          >
            <h2
              style={{
                color: 'white',
                fontSize: '32px',
                fontWeight: 'bold',
                marginLeft: '12px',
              }}
            >
              {receta.infoAdicional}
            </h2>
          </div>
        </div>
    </div>


  );
}

export default RecetaDetail;
