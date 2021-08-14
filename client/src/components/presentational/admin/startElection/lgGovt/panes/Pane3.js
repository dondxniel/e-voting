import { Form, Button, Card } from 'react-bootstrap';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';

const Pane3 = ({prevPane, nextPane, parties, setCandidate}) => {
    return (
        <>
            <p className="text-center">3/4</p>
            <Form>
                <Form.Group className = "my-3">
                    <Form.Label>Parties Candidates</Form.Label>
                    {parties.map( item => 
                        <Card className="p-2 my-1" key = {item.party._id}> 
                            {item.party.fullname}: <Form.Control data-party = {item.party._id} onChange = {setCandidate} type = "text" placeholder = "Contestant's Name."/>
                        </Card>
                    )}
                </Form.Group>
                <Form.Group className = "row">
                    <div className="col-6">
                        <Button variant = "default" className = "border rounded-pill p-3" onClick = {prevPane}><FaAngleLeft /> Prev</Button>
                    </div>
                    <div className="col-6 text-end">
                        <Button variant = "default" className = "border rounded-pill p-3" onClick = {nextPane}>Next <FaAngleRight /></Button>
                    </div>
                </Form.Group>
                
            </Form>
        </>
    )
}

export default Pane3
