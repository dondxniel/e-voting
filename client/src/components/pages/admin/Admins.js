import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { CREATE_ADMIN_ROUTE, FETCH_ADMINS_ROUTE, FETCH_STATES_ROUTE } from '../../../constants/endpoints';
import Loading from '../../presentational/Loading';
import Message from '../../presentational/Message';

const Admins = () => {
    const [ cookies ] = useCookies(['adminToken'])
    
    const [ admins, setAdmins ] = useState([]);
    const [ states, setStates ] = useState([]);
    
    const [ name, setName] = useState("");
    const [ email, setEmail] = useState("");
    const [ password, setPassword] = useState("");
    const [ selectedState, setSelectedState ] = useState("");
    const [ adminType, setAdminType] = useState("");
    const [ electionType, setElectionType] = useState("");
    
    const [ message, setMessage ] = useState(false);
    const [ submitting, setSubmitting ] = useState(false);
    const [ fetching, setFetching ] = useState(false);
    
    const resetState = () => {
        setName("");
        setEmail("");
        setPassword("");
        setAdminType("");
        setElectionType("");
    }
    
    const fetchStates = () => {
        axios({
            method: 'GET',
            url: FETCH_STATES_ROUTE,

        })
        .then(({data}) => {
            if(data.success){
                setStates(data.data);
            }else{
                setMessage({
                    variant: 'failure',
                    message: data.message
                })
            }
        })
        .catch(err => {
            setMessage({
                variant: 'failure',
                message: `${err}`
            })
        })
    }
    
    const handleSubmit = e => {
        e.preventDefault();
        if(name !== "" && email !== "" && password !== "" && selectedState !== "" && adminType !== "" && electionType !== ""){
            setSubmitting(true);
            axios({
                method: 'POST',
                url: CREATE_ADMIN_ROUTE,
                headers: {
                    'content-type': 'application/json',
                    'Authorization' : `${cookies['adminToken']}`
                },
                data: { name, email, password, selectedState, adminType, electionType }
            })
            .then(({data}) => {
                setSubmitting(false);
                resetState();
                if(data.success){
                    setMessage({
                        variant: 'success',
                        message: data.message
                    })
                    fetchAdmins();
                }else{
                    setMessage({
                        variant: 'failure',
                        message: `${data.message} -- ${data.data}`
                    })
                }
            })
            .catch(err => {
                setSubmitting(false);
                setMessage({
                    variant: 'failure',
                    message: err
                })
            })
        }else{
            setMessage({
                variant: 'failure',
                message: 'Finish filling the form before submitting.'
            })
        }

    }

    const fetchAdmins = () => {
        setFetching(true);
        axios({
            method: 'GET',
            url: FETCH_ADMINS_ROUTE,
            headers: {
                'content-type': 'application/json',
                'Authorization' : `${cookies['adminToken']}`
            },
        })
        .then(({data}) => {
            if(data.success){
                setAdmins(data.data);
            }else{
                setMessage({
                    variant: 'failure',
                    message: `${data.message}  ${data.data}`
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

    useEffect(() => {
        fetchAdmins();
        fetchStates();
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
                            <h3 className = "text-center">Create Admin</h3>
                            <Form onSubmit = {handleSubmit}>
                                <Form.Group className = "my-4">
                                    <Form.Control onChange = {e => setName(e.target.value)} value = {name} type = "text" placeholder = "Admin's Name"/>     
                                </Form.Group>
                                
                                <Form.Group className = "my-4">
                                    <Form.Control onChange = {e => setEmail(e.target.value)} value = {email} type = "email" placeholder = "Admin's Email"/>     
                                </Form.Group>
                                
                                <Form.Group className = "my-4">
                                    <Form.Control onChange = {e => setPassword(e.target.value)} value = {password} type = "password" placeholder = "Admin's Password"/>     
                                </Form.Group>
                                
                                
                                <Form.Group className = "my-4">
                                    <select className = "form-control" onChange = {e => setSelectedState(e.target.value)} value = {selectedState} id = "admin-state-select" placeholder = "Admin State">
                                        <option value = "">--Select Admin's State--</option>
                                        {states.map(item => (
                                            <option key = {item.pcode} value = {item.state}>{item.state}</option>    
                                        ))}    
                                    </select>     
                                </Form.Group>

                                <Form.Group className = "my-4">
                                    <select className = "form-control" onChange = {e => setAdminType(e.target.value)} value = {adminType} id = "admin-type-select" placeholder = "Admin Type">
                                        <option value = "">--Select Admin Type--</option>    
                                        <option value = "super">Super</option>    
                                        <option value = "sub">Sub</option>    
                                    </select>     
                                </Form.Group>
                                
                                <Form.Group className = "my-4">
                                    <select className = "form-control" onChange = {e => setElectionType(e.target.value)} value = {electionType} id = "election-type-select" placeholder = "Election Type">
                                        <option value = "">--Select Election Type--</option>    
                                        <option value = "local">Local Government</option>    
                                        <option value = "state">State Government</option>    
                                        <option value = "federal">Federal Government</option>    
                                    </select>     
                                </Form.Group>

                                <Form.Group className = "my-4 text-center">
                                    <Button 
                                        className = "border"
                                        type = "submit"
                                        variant = "default"
                                        disabled = {submitting? true : false}
                                    >
                                        {submitting ? <Loading variant = "sm" /> : "Create Admin"}
                                    </Button>
                                </Form.Group>
                                
                            </Form> 
                        </Col>
                        <Col md = {1}></Col>
                        <Col md = {5} className = "text-center">
                            <h3 className = "text-center mb-4">Current Admins</h3>
                            {
                                fetching?
                                <Loading variant = "lg" />
                                :
                                admins.map(item => (
                                    <Card key = {item._id} className = "my-1 p-1 px-3 text-start">
                                        {item.name}<br/> {item.email} <br/> {item.adminType}
                                        <br/>
                                        {item.state} <br/> 
                                        {item.electionType}
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

export default Admins
