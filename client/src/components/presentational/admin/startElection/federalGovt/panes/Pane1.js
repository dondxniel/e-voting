import { FaAngleRight } from 'react-icons/fa';
import { Form, Button } from 'react-bootstrap';

const Pane1 = ({nextPane, setElectionType, setLocation, location, consti, districts, electionType, state}) => {

    const returnLocationSelector = () => {
        if(electionType === "presidential"){
            return(
                <>
                    <>
                    <Form.Label>State (Automatically Selected)</Form.Label>
                    <Form.Control disabled as = "select" value = "kaduna">
                        <option value = {state} >{state}</option>
                    </Form.Control>
                </>
                </>
            )
        }else if(electionType === "senetorial"){
            return(
                <>
                    <Form.Label>Senetorial Districts</Form.Label>
                    <Form.Control as = "select" value = {[...location]} multiple onChange = {setLocation}>
                        <option value = "all">All</option>
                        {districts.map(item => (
                            <> 
                                <option key = {item.id} value = {item.name}>{item.name}</option>    
                            </>
                        ))}
                    </Form.Control>
                </>
            )
        }else if(electionType === "hor"){
            return(
                <>
                    <Form.Label>Federal Constituencies</Form.Label>
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
                    <Form.Control as = "select" onChange = {setElectionType} value = {electionType}>
                        <option value = "">----</option>
                        <option value = "presidential">Presidential</option>
                        <option value = "senetorial">Senetorial</option>
                        <option value = "hor">House of Representatives</option>
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
