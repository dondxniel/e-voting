import { Container, Row, Col, Form } from 'react-bootstrap';

const HouseOfAssembly = ({ children, data, state, stateConstituencies, setHoaData, selectedHoaConstituency }) => {
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
                                <select className="form-control" onChange={setHoaData} value={selectedHoaConstituency}>
                                    <option value="">--Select State Constituency--</option>
                                    {stateConstituencies.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}
                                </select>
                            </Form.Group>
                            <hr />
                            <Container>
                                {children}
                            </Container>
                        </Form>
                    </Col>
                }
            </Row>
        </Container>
    )
}

export default HouseOfAssembly
