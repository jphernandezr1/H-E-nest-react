import React, { useEffect, useState } from "react";
import RecetasCard from "../components/RecetaCard";
import { FaSearch } from "react-icons/fa";
import { FormattedMessage } from "react-intl";

function RecetasPage() {
  const [recetas, setRecetas] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const token = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    if (!navigator.onLine) {
      if (localStorage.getItem("recetas") === null) {
        setRecetas([]);
      } else {
        setRecetas(localStorage.getItem("recetas"));
      }
    } else {
      const URL = "http://localhost:2000/api/v1/recetas";
      fetch(URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((data) => data.json())
        .then((data) => {
          setRecetas(data);
          localStorage.setItem("recetas", data);
        });
    }
  }, []);

  const handleFiltroNombreChange = (event) => {
    setFiltroNombre(event.target.value);
  };

  const toggleOrden = () => {
    setOrdenAscendente(!ordenAscendente);
  };

  const recetasFiltradasOrdenadas =
    recetas.length > 0
      ? recetas
          .filter((receta) =>
            receta.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
          )
          .sort((a, b) => {
            if (ordenAscendente) {
              return a.calTotales - b.calTotales;
            } else {
              return b.calTotales - a.calTotales;
            }
          })
      : [];

  return (
    <div style={{ marginTop: '16px', width: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
      <div className="row">
        <div className="col-sm-8">
          <h1
            style={{
              color: "white",
              fontSize: "72px",
              fontWeight: "bold",
              marginLeft: "12px",
            }}
          >
            <FormattedMessage id="OurRecipes" />
          </h1>
        </div>
        <div
          className="col-sm-4"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={filtroNombre}
              onChange={handleFiltroNombreChange}
              style={{
                backgroundColor: "transparent",
                border: "none",
                borderBottom: "1px solid white",
                color: "white",
                fontSize: "16px",
                padding: "8px",
                paddingRight: "30px",
                width: "100%",
              }}
            />
            <FaSearch
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "white",
              }}
            />
          </div>
          <button
            onClick={toggleOrden}
            style={{
              width: "auto",
              color: "white",
              fontWeight: "bold",
              marginTop: "8px",
            }}
          >
            <FormattedMessage id="SortBy" />{" "}
            {ordenAscendente ? (
              <FormattedMessage id="MostCalories" />
            ) : (
              <FormattedMessage id="LestCalories" />
            )}
          </button>
        </div>
      </div>

      <div className="row">
        {recetasFiltradasOrdenadas.map((receta) => (
          <div className="col-md-12" key={receta.id}>
            <RecetasCard receta={receta} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecetasPage;
