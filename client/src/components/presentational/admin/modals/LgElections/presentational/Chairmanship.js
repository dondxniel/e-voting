import { useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';

const Charimanship = ({ children, data }) => {

    useEffect(() => {
        console.log(data);
    }, [])

    return (
        <Container>
            <Row>
                <Col>
                    <Form>
                        <Form.Group>
                            <Form.Label><b>Select Local Government</b></Form.Label>
                            <select className = "form-control">
                                <option>Open this select menu</option>
                                {/* {data.location.map(item => <option value={item}>{item}</option>)} */}
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

export default Charimanship
