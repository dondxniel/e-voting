import { useState } from 'react';
import { Modal, Button, Tabs, Tab, Container, Row } from 'react-bootstrap';
import { FaPrint } from 'react-icons/fa';
import Presedential from './presentational/Presedential';
import Senetorial from './presentational/Senetorial';
import HouseOfRepresentative from './presentational/HouseOfRepresentative';
import Statistics from '../presentational/Statistics';

const StateElectionsModal = ({ result }) => {

    const [ show, setShow ] = useState(false);
    
    return (
        <>
            <div className = "py-4 text-center election-type-dropdown text-light rounded-pill bg-success" onClick = {() => setShow(!show)}>
                FEDERAL GOVT. ELECTIONS
            </div> 
            <Modal
                show = {show}
                onHide = {() => setShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Federal Election results.
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className = "text-center justify-content-center">
                    <Container>
                        <Row>
                            <Tabs defaultActiveKey="gov" id="uncontrolled-tab-example" className="mb-3 text-center justify-content-center">
                                <Tab eventKey="gov" title="Presedential">
                                    <Presedential>
                                        <Statistics />
                                    </Presedential>
                                </Tab>
                                <Tab eventKey="sen" title="Senetorial">
                                    <Senetorial>
                                        <Statistics />
                                    </Senetorial>
                                </Tab>
                                <Tab eventKey="hor" title="House of Representative">
                                    <HouseOfRepresentative>
                                        <Statistics />
                                    </HouseOfRepresentative>
                                </Tab>
                            </Tabs>
                        </Row>
                        <Row className = "justify-content-center text-center">
                            <Button variant = "success">
                                <h1>
                                    <FaPrint />
                                </h1>
                                Print
                            </Button>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant = "danger" onClick={() => setShow(false)}>Close</Button>
                </Modal.Footer>
            </Modal>    
        </>
    )
}

export default StateElectionsModal
