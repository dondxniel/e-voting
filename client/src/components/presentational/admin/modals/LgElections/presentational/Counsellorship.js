import { Container, Row, Col, Form } from 'react-bootstrap';
import Statistics from '../../presentational/Statistics';

const Counsellorship = ({ children, data, lgas, wards, lgSelected, selectedLg, setSelectedWardFunc, selectedWard }) => {
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
                                <select className="form-control" onChange={lgSelected} value={selectedLg}>
                                    <option value="">--Select LGA--</option>
                                    {lgas.map(item => <option key={item.name} value={item.name}>{item.name}</option>)}
                                </select>
                            </Form.Group>
                            {(selectedLg !== "") && <Form.Group>
                                <Form.Label><b>Select Ward</b></Form.Label>
                                <select className="form-control" onChange={setSelectedWardFunc} value={selectedWard}>
                                    <option value="">--Select Ward--</option>
                                    {wards.map(item => <option key={item} value={item}>{item}</option>)}
                                </select>
                            </Form.Group>}
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

export default Counsellorship
