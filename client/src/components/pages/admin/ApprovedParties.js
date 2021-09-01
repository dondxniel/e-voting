import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { ADD_PARTY_ROUTE, FETCH_PARTIES_ROUTE }  from '../../../constants/endpoints';
import Loading from '../../presentational/Loading';
import Message from '../../presentational/Message';

const ApprovedParties = () => {
    const [ cookies ] = useCookies(['adminToken'])
    
    const [ parties, setParties ] = useState([]);
    
    const [ message, setMessage ] = useState(false);
    const [ submitting, setSubmitting ] = useState(false);
    const [ fetching, setFetching ] = useState(false);
    
    const [ fullName, setFullName] = useState("");
    const [ abb, setAbb] = useState("");
    
    const resetState = () => {
        setFullName("");
        setAbb("");
    }
    
    const handleSubmit = e => {
        e.preventDefault();
        if(fullName !== "" && abb !== ""){
            setSubmitting(true);
            axios({
                method: "POST",
                url: ADD_PARTY_ROUTE,
                headers: {
                    "content-type": "application/json",
                    'Authorization' : `${cookies['adminToken']}`
                },
                data: {fullname: fullName, abb}
            })
            .then(({data}) => {
                setSubmitting(false);
                if(data.success){
                    fetchParties();
                    setMessage({
                        variant: 'success',
                        message: `${data.message}`
                    })
                    
                }else{
                    setMessage({
                        variant: 'failure',
                        message: `${data.message}`
                    })
                }
                resetState();
            })
            .catch(err => {
                setSubmitting(false);
                setMessage({
                    variant: 'failure',
                    message: `${err}`
                })
            })
        }else{
            setMessage({
                variant: 'failure',
                message: "Finish filling the form before submitting."
            })
        }
    }

    const fetchParties = () => {
        setFetching(true);
        axios({
            method: "GET",
            url: FETCH_PARTIES_ROUTE,
            headers: {
                "content-type": "application/json",
                'Authorization' : `${cookies['adminToken']}`
            }
        })
        .then(({data}) => {
            if(data.success){
                setParties(data.data);
            }else{
                setMessage({
                    variant: 'failure',
                    message: `${data.message}`
                })
            }
            setFetching(false);
        })
        .catch(err => {
            setMessage({
                variant: 'failure',
                message: `${err}`
            })
            setFetching(false);
        })
    }
    
    useEffect(()=>{
        fetchParties();
    }, [])
    
    return (
        <Container>
            <Row className = "justify-content-center my-5">
                <Col md = {10}>
                    <Row>
                        {message && <Message message = {message} />}
                    </Row>
                    <Row>
                        <Col md = {6}>
                            <h3 className = "text-center">Create Party</h3>
                            <Form onSubmit = {handleSubmit} >
                                <Form.Group className = "my-4">
                                    <Form.Control onChange = {e => setFullName(e.target.value)} value = {fullName} type = "text" placeholder = "Party's Full Name"/>     
                                </Form.Group>
                                
                                <Form.Group className = "my-4">
                                    <Form.Control onChange = {e => setAbb(e.target.value)} value = {abb} type = "text" placeholder = "Party's Abbreviation"/>     
                                </Form.Group>

                                <Form.Group className = "my-4 text-center">
                                    <Button 
                                        className = "border"
                                        type = "submit"
                                        variant = "default"
                                        disabled = {submitting? true : false}
                                    >
                                        {submitting ? <Loading variant = "sm" /> : "Create Party"}
                                    </Button>
                                </Form.Group>
                                
                            </Form> 
                        </Col>
                        <Col md = {1}></Col>
                        <Col md = {5} className = "text-center">
                            <h3 className = "text-center">Current Approved Parties</h3>
                            {
                                fetching?
                                <Loading variant = "lg" />
                                :
                                parties.map(item => (
                                    <Card key = {item._id} className = "my-1 p-1 px-3 text-start">
                                        {item.fullname}<br/> {item.abb}
                                    </Card>
                                ))
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default ApprovedParties
