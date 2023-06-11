import Container from "react-bootstrap/Container";
import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Post from '../components/Post-Metricas';
import '../index.css';
import axios from "axios";
import { FormattedMessage } from "react-intl";
import { useParams } from "react-router-dom";




function MetricsPage() {
  const { metricsId } = useParams();
  const [metricas, setMet] = useState([]);
  const token = sessionStorage.getItem('jwtToken');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  useEffect(() => {
    const getmets = async () => {
      if (navigator.onLine){ 
        const url = `http://localhost:2000/api/v1/perfil/${metricsId}/metricas`;
        await axios
          .get(url)
          .then((res) => {
            setMet(res.data);
            localStorage.setItem("metrics"+metricsId, JSON.stringify(res.data))
          })
          .catch((err) => {
            alert("Error " + JSON.stringify(err));
          });
      }
      else {
        if(localStorage.getItem("metrics"+metricsId)) {
          setMet(JSON.parse(localStorage.getItem("comments"+metricsId)));
      }
      }};
      getmets();
    }, []);

    return (
      <div className="p-4 sm:p-8">
        <div class="relative">
          <a href="/usuarios" class="absolute top-0 right-0 mt-4 mr-4 text-white">
            <FormattedMessage id="Vuelta" />{" "}
          </a>
        </div>
        <div className="flex flex-col">
          <h1 className="text-white text-2xl font-semibold mb-4">
            <FormattedMessage id="metText"/>
            </h1>
          <div className="flex flex-wrap justify-center gap-4">
          <Container className="mt-3">
            <Row>
              {metricas.map((metrica) => (
              <Post name= {metrica.nombre} nombreMet={metrica.unidad} followers={metrica.valor} hours={0}  />
            ))}
            </Row>
          </Container>
          </div>
        </div>
      </div>
    );
  }
  
  export default MetricsPage;
  