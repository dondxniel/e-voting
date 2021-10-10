import { Container, Row, Col, Form } from 'react-bootstrap';

const HouseOfRepresentative = ({ children, data, state, federalConstituencies, setHorData }) => {
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
                                <Form.Label><b>Select Constituency</b></Form.Label>
                                <select className="form-control" onChange={setHorData}>
                                    <option value="">--Select Federal Constituency--</option>
                                    {federalConstituencies.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}
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

export default HouseOfRepresentative
