import { FaAngleRight } from 'react-icons/fa';
import { Form, Button } from 'react-bootstrap';

const Pane1 = ({nextPane, setElectionType, setLocation, location, electionType, lgas}) => {

    const returnLocationSelector = () => {
        if(electionType === "chairmanship"){
            return(
                <>
                    <Form.Label>Local government</Form.Label>
                    <Form.Control as = "select" value = {[...location]} multiple onChange = {setLocation}>
                        <option value = "all" >All</option>
                        {lgas.map(item => (
                            <option key = {item.name} value = {item.name}>{item.name}</option>    
                        ))}
                    </Form.Control>
                </>
            )
        }else if(electionType === "counselorship"){
            return(
                <>
                    <Form.Label>Ward</Form.Label>
                    <Form.Control as = "select" value = {[...location]} multiple onChange = {setLocation}>
                        <option value = "all">All</option>
                        {lgas.map(lga => (
                            <>
                                <option key = {lga.name} className = "font-weight-bold" disabled>{`${lga.name} Local Government`}</option>    
                                {lga.wards.map(ward => (
                                    <option key = {`${ward}-${lga}`} value = {ward}>{ward}</option>    
                                ))}
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
                        <option value = "chairmanship">Charimanship</option>
                        <option value = "counselorship">Counselorship</option>
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
