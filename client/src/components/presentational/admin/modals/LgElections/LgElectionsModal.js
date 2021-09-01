import { useState, useEffect } from 'react';
import { Modal, Button, Tabs, Tab, Container, Row } from 'react-bootstrap';
import { FaPrint } from 'react-icons/fa';
import Chairmanship from './presentational/Chairmanship';
import Counsellorship from './presentational/Counsellorship';
import Statistics from '../presentational/Statistics';

const LgElectionsModal = ({ result }) => {

    const [ show, setShow ] = useState(false);
    const [chairmanship, setChairmanship] = useState({});
    const [counsellorship, setCounsellorship] = useState({});

    const setData = () => {
        let chair = result.filter(item => item.electionType === 'chairmanship');
        let counsel = result.filter(item => item.electionType === 'counsellorship');

        setChairmanship(chair[0]);
        setCounsellorship(counsel[0]);
        console.log(chairmanship);
        console.log(counsellorship);
    }

    const setCharimanshipData = e => {
        let val = e.target.value;

    }

    useEffect(() => {
        setData();
    }, [])
    
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
                                    <Chairmanship data={chairmanship}>
                                        <Statistics data={chairmanship} />
                                    </Chairmanship>
                                </Tab>
                                <Tab eventKey="counsellorship" title="Counsellorship">
                                    <Counsellorship data={counsellorship}>
                                        <Statistics data={counsellorship} />
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
