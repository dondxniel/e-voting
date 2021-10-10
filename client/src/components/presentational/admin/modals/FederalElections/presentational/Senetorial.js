import { Container, Row, Col, Form } from 'react-bootstrap';

const Senetorial = ({ children, data, state, senetorialDistricts, setSenetorialData }) => {
    return (
        <Container>
            <Row>
                {(Object.keys(data).length === 0) ?
                    <p className="alert alert-danger p-3 m-3 text-center">No election to show</p>
                    :
                    <Col>
                        <Form>
                            <Form.Group>
                                <Form.Label><b>Select State (Automatically selected)</b></Form.Label>
                                <select className="form-control disabled-input" disabled>
                                    <option value={state}>{state}</option>
                                </select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label><b>Select District</b></Form.Label>
                                <select className="form-control" onChange={setSenetorialData}>
                                    <option value="">--Select Senatorial District--</option>
                                    {senetorialDistricts.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}
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

export default Senetorial
