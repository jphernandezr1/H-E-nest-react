import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import {useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import React from 'react';
function RutinaCard(props){

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/rutinas/${props.rutina.id}`);
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
                <div class="row" style={{ width:'100%'}} >
                    <div class="col-sm-4" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>{props.rutina.nombre}</h2>
                    </div>
                    <div class="col-sm-4 d-flex flex-column" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 'bold'}}>{props.rutina.infoAdicional}</h3>
                    </div>
                    <div class="col-sm-4" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Button style={{padding:'2px',backgroundColor: '#FF8C00', border: 'none'}} onClick={handleClick} ><FormattedMessage id="Ver ejercicios"/></Button>
                    </div>
                </div>
            </div>
        </div>


                
    )

}

export default RutinaCard;