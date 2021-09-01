import { Container, Row, Col, Form } from 'react-bootstrap';

const HouseOfAssembly = ({children}) => {
    return (
        <Container>
            <Row>
                <Col>
                    <Form>
                        <Form.Group>
                            <Form.Label><b>Select Constituency</b></Form.Label>
                            <select className = "form-control">
                                <option>Open this select menu</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                            <hr />
                            <Container>
                                {children}
                            </Container>
                        </Form.Group>
                    </Form>
                </Col>   
            </Row> 
        </Container>
    )
}

export default HouseOfAssembly
