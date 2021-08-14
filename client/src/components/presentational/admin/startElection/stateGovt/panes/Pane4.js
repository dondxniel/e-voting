import { Form, Button } from 'react-bootstrap';
import { FaAngleLeft } from 'react-icons/fa';

const Pane4 = ({prevPane, nextPane, setDate, date}) => {
    return (
        <>
            <p className="text-center">4/4</p>
            <Form>
                <Form.Group className = "my-3">
                    <Form.Label>Election Date</Form.Label>
                    <Form.Control value = {date} type = "date" onChange = {setDate} />
                </Form.Group>
                <Form.Group className = "row">
                    <div className="col-6">
                        <Button variant = "default" className = "border rounded-pill p-3" onClick = {prevPane}><FaAngleLeft /> Prev</Button>
                    </div>
                    <div className="col-6 text-end">
                        <Button variant = "default" className = "border border-success rounded-pill p-3" onClick = {nextPane}>Start Election </Button>
                    </div>
                </Form.Group>
            </Form>
        </>
    )
}

export default Pane4
