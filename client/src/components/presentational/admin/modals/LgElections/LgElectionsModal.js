import { useState } from 'react';
import { Modal, Button, Tabs, Tab, Container, Row } from 'react-bootstrap';
import { FaPrint } from 'react-icons/fa';
import Chairmanship from './presentational/Chairmanship';
import Counsellorship from './presentational/Counsellorship';
import Statistics from '../presentational/Statistics';

const LgElectionsModal = () => {

    const [ show, setShow ] = useState(false);
    
    return (
        <>
            <div className = "py-4 text-center election-type-dropdown text-light rounded-pill bg-success" onClick = {() => setShow(!show)}>
                LOCAL GOVT. ELECTIONS
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
                        Local Government Election results.
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className = "text-center justify-content-center">
                    <Container>
                        <Row>
                            <Tabs defaultActiveKey="chairmanship" id="uncontrolled-tab-example" className="mb-3 text-center justify-content-center">
                                <Tab eventKey="chairmanship" title="Chairmanship">
                                    <Chairmanship>
                                        <Statistics />
                                    </Chairmanship>
                                </Tab>
                                <Tab eventKey="counsellorship" title="Counsellorship">
                                    <Counsellorship>
                                        <Statistics />
                                    </Counsellorship>
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

export default LgElectionsModal
