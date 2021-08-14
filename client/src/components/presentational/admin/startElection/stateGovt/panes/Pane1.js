import { FaAngleRight } from 'react-icons/fa';
import { Form, Button } from 'react-bootstrap';

const Pane1 = ({nextPane, setElectionType, setLocation, location, consti, electionType, state}) => {

    const returnLocationSelector = () => {
        if(electionType === "governorship"){
            return(
                <>
                    <Form.Label>State (Automatically Selected)</Form.Label>
                    <Form.Control disabled as = "select" value = "kaduna">
                        <option value = {state} >{state}</option>
                    </Form.Control>
                </>
            )
        }else if(electionType === "hoa"){
            return(
                <>
                    <Form.Label>State Constituencies</Form.Label>
                    <Form.Control as = "select" value = {[...location]} multiple onChange = {setLocation}>
                        <option value = "all">All</option>
                        {consti.map(item => (
                            <> 
                                <option key = {item.id} value = {item.name}>{item.name}</option>    
                            </>
                        ))}
                    </Form.Control>
                </>
            )
        }
    }
    
    return (
        <>
            <p className="text-center">1/4</p>
            <Form>
                <Form.Group className = "my-3">
                    <Form.Label>Election Type</Form.Label>
                    <Form.Control value = {electionType} as = "select" onChange = {setElectionType}>
                        <option value = "">----</option>
                        <option value = "governorship">Governorship</option>
                        <option value = "hoa">House of Assembly</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group className = "my-3">
                    {returnLocationSelector()}
                </Form.Group>
                <Form.Group className = "text-end">
                    <Button variant = "default" className = "rounded-pill p-3 border" onClick = {nextPane} >
                        Next <FaAngleRight />
                    </Button>
                </Form.Group>
            </Form>
        </>
    )
}

export default Pane1
