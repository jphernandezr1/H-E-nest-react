import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import PostUser from "../components/Post-Usuarios";
import "../index.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FormattedMessage } from "react-intl";

function UserPage() {
  const [usuarios, setUsuarios] = useState([]);
  const token = sessionStorage.getItem("jwtToken");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    const getusers = async () => {
      if (navigator.onLine) {
        const url = "http://localhost:2000/api/v1/perfil";
        await axios
          .get(url)
          .then((res) => {
            setUsuarios(res.data);
            localStorage.setItem("users", JSON.stringify(res.data));
          })
          .catch((err) => {
            alert("Error " + JSON.stringify(err));
          });
      } else {
        if (localStorage.getItem("users")) {
          setUsuarios(JSON.parse(localStorage.getItem("users")));
        }
      }
    };
    getusers();
  }, []);
  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col">
        <h1 className="text-white text-2xl font-semibold mb-4">
          <FormattedMessage id="userText" />
        </h1>
        <div className="flex flex-wrap justify-center gap-4">
          <Container className="mt-3 flex flex-wrap gap-4">
            {usuarios.map((user) => (
              <PostUser
                link={`metricas/${user.id}`}
                name={user.nombre}
                correo={user.correo}
                fecha={user.fechaDeNacimiento}
              />
            ))}
          </Container>
        </div>
      </div>
    </div>
  );
}

export default UserPage;
