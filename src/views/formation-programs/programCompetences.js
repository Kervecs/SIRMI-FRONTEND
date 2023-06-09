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
import { swalWithBootstrapButtons } from "plugins/alerts";
import "../../../src/components/Headers/header.css";
import { useParams } from "react-router-dom";
import AssignCompetences from "./assignCompetences";
import { alert } from "plugins/alerts";
import { getFormationProgramService, deallocateCompetencesService } from "services/formationPrograms";
import Swal from "sweetalert2";
import { allCompetencesService } from "services/competences";
import Spinner from "../../components/loader"
import PaginationData from "plugins/pagination";

const ProgramCompetences = () => {
  const { id } = useParams();
  
  
  const [formationProgram, setFormationProgram] = useState([]);
  const [competencesByProgram, setCompetencesByProgram] = useState([]);
  const [allCompetences, setAllCompetences] = useState([]);
  
  useEffect(() => {
    showCompetences()
    showFormationProgram(id);
  }, [id, formationProgram, competencesByProgram]);
  
  const [search, setSearch] = useState("");
  const [ loading ,setLoading] = useState(true);

  const [userPerPage, setUserPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const showFormationProgram = async (id) => {
     const data = await getFormationProgramService(id)
      setFormationProgram(data.results);
      setCompetencesByProgram(data.results.competences);
  };

  const showCompetences = async () => {
    const data = await allCompetencesService()
      setAllCompetences(data.results);
      setLoading(false)
  };

  const totalCompetencesByProgram = competencesByProgram.length

  const deallocateCompetence = async (competence) => {
    const alertParams = {
      title: "¿Está seguro de quitarle la competencia al programa de formación?",
      icon: "warning",
    };
    const confirmed = await alert(alertParams)

    if (confirmed.isConfirmed) {
      const data = await deallocateCompetencesService(formationProgram._id, {competence: competence})
      if(data.status === 'success'){
        swalWithBootstrapButtons.fire(
          'Eliminado!',
          data.message,
          'success'
        )
      }
      else{
        swalWithBootstrapButtons.fire(
          'Error!',
          data.message,
          'error'
        )
      }
      } else if (
      confirmed.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire(
        'Cancelado!',
        '',
        'info'
      )
    }
  };


  //funcion de busqueda
  const searcher = (e) => {
    setSearch(e.target.value);
  };

  //metodo de filtrado
  let competences = [];

  if (!search) {
    competences = competencesByProgram;
  } else {
    competences = competencesByProgram.filter((competence) =>
      competence.labor_competition
        .toLowerCase()
        .includes(search.toLocaleLowerCase())
    );
  }

  return (
    <>
      <Header title={"Gestionar competencias laborales del programa de formación"} />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="formulario ">
              <CardHeader className="border-0">
                <Col lg="1" className="p-0">
                    <AssignCompetences  program={formationProgram} competences={allCompetences}/>
                </Col>

                <Col lg="7">
                  <h3 className="d-flex">
                    ROGRAMA DE FORMACIÓN<h3 className="ml-2 text-gray">"{formationProgram.program_name}"</h3>
                  </h3>
                </Col>

                <Col lg="4">
                  <div>
                    <input
                      value={search}
                      onChange={searcher}
                      type="search"
                      placeholder="Buscar"
                      className="input"
                    />
                  </div>
                </Col>
              </CardHeader>
              <Table
                className=" table table-striped table-hover  shadow-lg align-items-center table-flush"
                responsive
              >
                <thead className="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Competencia laboral</th>
                    <th scope="col">Código de la competencia laboral</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                {loading && < Spinner/>}

                  {competences.map((competence, i = 0) => {
                      return (
                        <tr key={competence._id}>
                          <td>
                            <Badge color="" className="badge-dot mr-4">
                              <i className="bg-success" />
                              {i + 1}
                            </Badge>
                          </td>

                          <td>{competence.labor_competition}</td>

                          <td>{competence.labor_competence_code}</td>

                          <td>
                            <Button
                              id="btn-competence-deallocate"
                              variant=""
                              onClick={() =>
                                deallocateCompetence(competence._id)
                              }
                            >
                              <i className="fas fa-trash-alt"></i>
                            </Button>
                            <UncontrolledTooltip
                              className="tooltip-inner"
                              delay={0}
                              placement="top"
                              target="btn-competence-deallocate"
                            >
                              Quitar competencia
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
                  totalData={totalCompetencesByProgram}
                />
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default ProgramCompetences;
