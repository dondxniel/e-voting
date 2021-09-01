import { Form, Button } from 'react-bootstrap';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const Pane2 = ({prevPane, nextPane, setParty, parties }) => {
    return (
        <>
            <p className="text-center">2/4</p>
            <Form>
                <Form.Group className = "my-3">
                    <Form.Label>Contesting Parties</Form.Label>
                    <Form.Control as = "select" multiple onChange = {setParty} >
                        {parties.map(party => (
                            <option value = {party._id}>{party.fullname} ({party.abb})</option>
                        ))}
                        
                    </Form.Control>
                </Form.Group>
                <Form.Group className = "row">
                    <div className="col-6">
                        <Button variant = "default" className = "border rounded-pill p-3" onClick = {prevPane}><FaAngleLeft /> Prev </Button>
                    </div>
                    <div className="col-6 text-end">
                        <Button variant = "default" className = "border rounded-pill p-3" onClick = {nextPane}>Next <FaAngleRight /></Button>
                    </div>
                </Form.Group> 
            </Form>   
        </>
    )
}

export default Pane2
