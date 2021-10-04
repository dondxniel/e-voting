import { Container, Row, Col, Form } from 'react-bootstrap';

const Charimanship = ({ children, data, lgas, setCharimanshipData, selectedLg }) => {

    return (
        <Container>
            <Row>
                {(Object.keys(data).length === 0) ?
                    <p className="alert alert-danger p-3 m-3 text-center">No election to show</p>
                    :
                    <Col>
                        <Form>
                            <Form.Group>
                                <Form.Label><b>Select Local Government</b></Form.Label>
                                <select className="form-control" onChange={setCharimanshipData} value={selectedLg}>
                                    <option>Open this select menu</option>
                                    {lgas.map(item => <option key={item.name} value={item.name}>{item.name}</option>)}
                                </select>
                            </Form.Group>
                        </Form>
                        <hr />
                        <Container>
                            {children}
                        </Container>
                    </Col>
                }
            </Row>
        </Container>
    )
}

export default Charimanship
