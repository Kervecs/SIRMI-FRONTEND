import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { UncontrolledTooltip } from "reactstrap";

function DetailContracts({ contract }) {

  const [isShow, invokeModal] = useState(false);
  const initModal = () => {
    return invokeModal(!isShow);
  };

  const user = contract.user;

  return (
    <>
      <Button id="btn-detail-contract" variant="" onClick={initModal}>
        <i className="fas fa-eye-solid fa-eye" />
      </Button>

      <UncontrolledTooltip
        className="tooltip-inner"
        delay={0}
        placement="top"
        target="btn-detail-contract"
      >
          Ver detalles del contrato
      </UncontrolledTooltip>

      <Modal show={isShow} size={"lg"} className=" color ">
        <div className="container">
          <Modal.Header className="justify-content-end pb-0">
              <i className="fas fa-remove" style={{cursor: 'pointer'}} onClick={initModal}></i>
          </Modal.Header>
          <Modal.Body className="pt-0">
              <Form.Group className="text-center mb-4">
                <h1>Detalles contrato</h1>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Contrato del usuario</Form.Label>
                <h3>{user.first_name} {user.last_name}</h3>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Número de contrato</Form.Label>
                <h3>{contract.contract_number}</h3>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Objeto</Form.Label>
                <h3>{contract.object}</h3>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Valor y forma de pago</Form.Label>
                <h3>{contract.pay}</h3>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Fecha inicio</Form.Label>
                <h3>{contract.start_date}</h3>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Fecha fin</Form.Label>
                <h3>{contract.end_date}</h3>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Tipo de contrato</Form.Label>
                <h3>{contract.type_contract}</h3>
              </Form.Group>
          </Modal.Body>

          <Modal.Footer>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
}

export default DetailContracts;
