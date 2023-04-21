/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */

// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  Table,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "../../../src/components/Headers/header.css";
import { Link, NavLink as NavLinkRRD } from "react-router-dom";
import { alert } from "plugins/alerts.js";
import Swal from "sweetalert2";
import { swalWithBootstrapButtons } from "plugins/alerts";
import Spinner from "../../components/loader"
import PaginationData from "plugins/pagination";
import { allAssignedFormationsService } from "services/assignedFormations";
import { deleteAssignedFormationService } from "services/assignedFormations";
import DetailAssignedFormation from "./detailAssignedFormation";

const ListAssignedFormations = () => {

  const [assignedFormations, setAssignedFormations] = useState([]);

  const [search, setSearch] = useState("");
  const [ loading ,setLoading] = useState(true);

  const [userPerPage, setUserPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    showAssignedFormations();
  }, []);

  const showAssignedFormations = async () => {
    const data = await allAssignedFormationsService();
    setAssignedFormations(data.results);
    setLoading(false)
  };

  const totalAssignedFormations = assignedFormations.length 

  const deleteAssignedFormation = async (id) => {
    const alertParams = {
      title: "¿Está seguro de eliminar el reporte de formación asignada?",
      icon: "warning",
    };
    const confirmed = await alert(alertParams);

    if (confirmed.isConfirmed) {
      const data = await deleteAssignedFormationService(id);
      if (data.status === "success") {
        swalWithBootstrapButtons.fire("Eliminado!", data.message, "success");
      } else {
        swalWithBootstrapButtons.fire("Error!", data.message, "error");
      }
    } else if (confirmed.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire("Cancelado!", "", "info");
    }
  };

  //funcion de busqueda
  const searcher = (e) => {
    setSearch(e.target.value);
  };

  //metodo de filtrado
  let result = [];

  if (!search) {
    result = assignedFormations;
  } else {
    result = assignedFormations.filter((dato) =>
      dato.ficha
        .toLowerCase()
        .includes(search.toLocaleLowerCase())
    );
  }

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="formulario ">
              <CardHeader className="border-0">
                <Col lg="6">
                  <Link
                    to={`/admin/registerassignedformation`}
                    tag={NavLinkRRD}
                    activeclassname="active"
                  >
                    <button className="btn btn-success bg-success">
                      Registrar
                    </button>
                  </Link>
                </Col>

                <Col lg="6">
                  <input
                    value={search}
                    onChange={searcher}
                    type="search"
                    placeholder="search"
                    className="input"
                  />
                </Col>
              </CardHeader>
              <Table
                className=" table table-striped table-hover  shadow-lg align-items-center table-flush"
                responsive
              >
                <thead className="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Ficha</th>
                    <th scope="col">Actividad</th>
                    <th scope="col">Horas al mes</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                {loading && < Spinner/>}

                  {result
                    .map((assignedFormation, i = 0) => {
                      return (
                        <tr key={assignedFormation._id}>
                          <td>
                            <Badge color="" className="badge-dot mr-4">
                              <i className="bg-success" />
                              {i + 1}
                            </Badge>
                          </td>

                          <td>{assignedFormation.ficha}</td>

                          <td>{assignedFormation.activity}</td>

                          <td>{assignedFormation.hours_month}</td>

                          <td>
                            <DetailAssignedFormation assignedFormation={assignedFormation} />

                            <Link
                              to={`/admin/updateassignedformation/${assignedFormation._id}`}
                              tag={NavLinkRRD}
                              activeclassname="active"
                            >
                              <Button variant="" id="btn-program-edit">
                                <i className="fas fa-pen-alt"></i>
                              </Button>
                              <UncontrolledTooltip
                                className="tooltip-inner"
                                delay={0}
                                target="btn-program-edit"
                              >
                                Actualizar reporte
                              </UncontrolledTooltip>
                            </Link>

                            <Button
                              variant=""
                              id="btn-program-delete"
                              onClick={() =>
                                deleteAssignedFormation(assignedFormation._id)
                              }
                            >
                              <i className="fas fa-trash-alt"></i>
                            </Button>
                            <UncontrolledTooltip
                              className="tooltip-inner"
                              delay={0}
                              target="btn-program-delete"
                            >
                              Eliminar reporte
                            </UncontrolledTooltip>
                          </td>
                        </tr>
                      );
                    })
                    .slice((currentPage - 1) * 7, (currentPage - 1) * 7 + 7)}
                </tbody>
              </Table>

              <CardFooter className="py-4">
                <PaginationData
                  userPerPage={userPerPage}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalData={totalAssignedFormations}
                />
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default ListAssignedFormations;