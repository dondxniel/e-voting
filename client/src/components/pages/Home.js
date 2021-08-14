import { Container, Row, Col, Jumbotron, ListGroup } from 'react-bootstrap';

const Home = () => {
    return (
        <div>
            <Jumbotron className = "jumbo text-light d-flex align-items-center flex-column">
                <div className="my-auto text-light px-5 text-center">
                    <Container>
                        <h2>Every Nigerian is entitled</h2>
                        <p>
                            to safe, stress free, free and fair elections. It's a basic human right that must be respected and held sacred.
                        </p>
                    </Container>
                </div>
            </Jumbotron>
            <Container>
                <Row>
                    <div className="text-center py-5">
                        <h2>How to vote</h2>
                    </div>
                </Row>
                <Row className = "justify-content-center text-center">
                    <Col md = {6}>
                        <ListGroup>
                            <ListGroup.Item className = "">
                                <span className = "font-weight-bold text-success">1.</span>
                                <br />
                                <p className="small">
                                    Register by clicking the <span className="font-weight-bold text-success">Become Registered Voter</span> button above.
                                </p>
                            </ListGroup.Item>
                            <ListGroup.Item className = "">
                                <span className = "font-weight-bold text-success">2.</span>
                                <br />
                                <p className="small">
                                    Dial <span className="font-weight-bold text-success">*3356*43#</span> on your mobile phone to select an election and vote.
                                </p>
                            </ListGroup.Item>
                            <ListGroup.Item className = "">
                                <span className = "font-weight-bold text-success">3.</span>
                                <br />
                                <p className="small">
                                <span className="font-weight-bold text-danger">Note: </span> An election will only show up if you have registered as a citizen of the local government, state or constituency it is being carried out.
                                </p>
                            </ListGroup.Item>                            
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Home
