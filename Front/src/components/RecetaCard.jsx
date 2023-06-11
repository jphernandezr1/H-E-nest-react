import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import {useNavigate } from "react-router-dom";
import React from 'react';
import { FormattedMessage } from "react-intl";
function RecetasCard(props){

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/recetas/${props.receta.id}`);
      };

    return(
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
                class="container"
                style={{
                backgroundColor: '#363636',
                padding: '16px',
                margin: '16px',
                width: '90vw',
                }}
            >
                <div class="row" style={{ width:'100%'}}>
                    <div class="col-sm-4" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>{props.receta.nombre}</h2>
                    </div>
                    <div class="col-sm-4 d-flex flex-column" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 'bold'}}>{props.receta.descripcion}</h3>
                        <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>Calorias Totales: {props.receta.calTotales}</h3>
                    </div>
                    <div class="col-sm-4" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Button style={{backgroundColor: '#FF8C00', border: 'none'}} onClick={handleClick}><FormattedMessage id="SeeMore"/></Button>
                    </div>
                </div>
            </div>
        </div>


                
    )

}

export default RecetasCard;