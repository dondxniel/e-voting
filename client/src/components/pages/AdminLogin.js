import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Loading from '../presentational/Loading';
import { LOGIN_ROUTE } from '../../constants/endpoints';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { set_login } from '../../constants/actions';

const AdminLogin = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const adminLoggedIn = useSelector(state => state.adminLoggedIn);

    const [ cookies, setCookie ] = useCookies(['adminToken', 'adminType', 'electionType', 'adminState']);

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ message, setMessage ] = useState(false);

    const resetForm = () => {
        setEmail("");
        setPassword("");
    }

    const login = () => {
        if(email !== "" && password !== ""){
            setLoading(true);
            axios({
                method : "POST",
                url : LOGIN_ROUTE,
                headers : {
                    "content-type": "application/json"
                },
                data: { email, password }
            })
            .then(({data}) => {
                setLoading(false);
                if(data.success){
                    var tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate()+1);//Expires in one day

                    setCookie('adminToken', `Bearer ${data.data.token}`, {path: '/', expires: tomorrow});
                    setCookie('adminType', data.data.admin.adminType, {path: '/', expires: tomorrow});
                    setCookie('electionType', data.data.admin.electionType, {path: '/', expires: tomorrow});
                    setCookie('adminState', data.data.admin.state, {path: '/', expires: tomorrow});
                    dispatch(set_login(data.data.admin));
                    setMessage({
                        variant: "success",
                        message: data.message
                    })
                    resetForm();
                    history.push("/admin/home");
                }else{
                    setMessage({
                        variant: "failure",
                        message: data.message
                    })
                }
            })
            .catch(err => {
                setLoading(false);
                setMessage({
                    variant: "failure",
                    message: `There has been an error: ${err}`
                })
            })
        }else{
            setMessage({
                variant: "failure",
                message: "You have to finish filling the form before submitting."
            })
        }
    }

    const handleSubmit = e => {
        e.preventDefault();
        login();
    }
    
    return (
        <Container>
            <Row>
                <div className="text-center pt-5 ">
                    <h2>Admin Login</h2>
                </div>
            </Row>
            <Row>
                {message ? <div className = {`alert ${(message.variant === 'success')? 'alert-success' : ((message.variant === 'failure') && 'alert-danger')} text-center`}>{message.message}</div>:null}
            </Row>
            <Row className = "justify-content-center text-center my-5">
                <Col md = {4}>
                    <div className="login-form-box">
                        <Form onSubmit = {handleSubmit}>
                            <Form.Group controlId="email" className = "my-1">
                                <Form.Label><b>Email</b></Form.Label>
                                <Form.Control type="email" value = {email} onChange = {e => setEmail(e.target.value)} placeholder="name@example.com" />
                            </Form.Group>
                            <br />
                            <Form.Group controlId="password" className = "my-1">
                                <Form.Label><b>Password</b></Form.Label>
                                <Form.Control type="password" value = {password} onChange = {e => setPassword(e.target.value)} placeholder="*****" />
                            </Form.Group>
                            <Form.Group controlId="submit" className = "mt-5">
                                <Button 
                                variant = "default" type = "submit"
                                className = "border"
                                disabled = {loading}
                                >
                                    {loading?
                                    <Loading variant = "sm"/>
                                    :
                                    "Login"
                                    }
                                </Button>
                            </Form.Group>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default AdminLogin
