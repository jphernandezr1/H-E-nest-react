import React from 'react';
import Card from 'react-bootstrap/Card';

function IngredienteCard(props) {
  const { nombre, descripcion, calorias, infoAdicional } = props.ingrediente;

  return (
    <Card className="text-center" style={{ width: 'fit-content', backgroundColor: '#272727', color: 'white', padding:'0px 20px'}}>
      <Card.Body className="d-flex flex-column justify-content-center">
        <Card.Title style={{ 
          fontSize: '28px',
          fontWeight: 'bold',
        }}>{nombre}</Card.Title>
        <Card.Text>{descripcion}</Card.Text>
        <Card.Text>{calorias} Calorias</Card.Text>
        <Card.Text>{infoAdicional}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default IngredienteCard;
