import { Container, Row, Col, Form } from 'react-bootstrap';

const Presedential = ({ children, data, state, setPresidentialData }) => {
    return (
        <Container>
            <Row>
                {(Object.keys(data).length === 0) ?
                    <p className="alert alert-danger p-3 m-3 text-center">No election to show</p>
                    :
                    <Col>
                        <Form>
                            <Form.Group>
                                <Form.Label><b>Select State</b></Form.Label>
                                <select onChange={setPresidentialData} className="form-control" >
                                    <option value="">--Select State--</option>
                                    <option value={state}>{state}</option>
                                </select>
                                <hr />
                                <Container>
                                    {children}
                                </Container>
                            </Form.Group>
                        </Form>
                    </Col>
                }
            </Row>
        </Container>
    )
}

export default Presedential
