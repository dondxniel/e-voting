import { useState, useEffect } from 'react';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import Loading from '../presentational/Loading.js';
import axios from 'axios';
import { REGISTER_VOTER, FETCH_STATES_ROUTE } from '../../constants/endpoints';

const RegisterAsVoter = () => {

    const [ formData, setFormData ] = useState({
        firstname: "", lastname: "",
        dob: "", nin: "", nationality: "",
        stateOfOrigin: "", lga: "", ward: "", 
        senetorialDistrict: "", hoaConstituency: "", horConstituency: ""
    })
    const [ lgas, setLgas ] = useState([]);
    const [ wards, setWards ] = useState([]);
    const [ hoaConstituencies, setHoaConstituencies ] = useState([]);
    const [ horConstituencies, setHorConstituencies ] = useState([]);
    const [ senetorialDistricts, setSenetorialDistricts ] = useState([]);

    const [ loading, setLoading ] = useState(false);
    const [ message, setMessage ] = useState(false);
    const [ ninVerified, setNinVerified ] = useState(false);
    const [ ninEntered, setNinEntered ] = useState(false);
    const [ ninMessage, setNinMessage ] = useState(false);

    const resetState = () => {
        setFormData({
            firstname: "", lastname: "", dob: "", nin: "", nationality: "", stateOfOrigin: "", lga: "", ward: "", senetorialDistrict: "", hoaConstituency: "", horConstituency: ""
        })
    }

    const verifyNin = e => {
        let nin = e.target.value.trim();
        // var regExp = /[a-zA-Z]/g; //Checking for letters
        var regExp = /^\d+$/;
        
        if(regExp.test(nin)){
            // do something if only numbers are not found in your string 
            setNinVerified(true);
            setNinMessage({
                variant: true,
                message: "NIN valid."
            })
        } else {
            //do something if letters or special characters are found in your string 
            setNinVerified(false);
            setNinMessage({
                variant: false,
                message: "You are only allowed to enter numbers as part of your NIN."
            })
        }
    }
    
    const setLga = e => {
        let lgaVal = e.target.value.trim();
        setFormData(prev => ({ ...prev, lga: lgaVal }));
        let specificLga = lgas.filter(item => {
            if (item.name === lgaVal) return true
        });
        specificLga = specificLga[0];
        setWards(specificLga.wards)
    }
    const setNin = e => {
        setNinEntered(true);
        setFormData(prev => ({ ...prev, nin: e.target.value.trim() }))
    }
    const setFirstname = e => setFormData(prev => ({ ...prev, firstname: e.target.value.trim() }))
    const setLastname = e => setFormData(prev => ({ ...prev, lastname: e.target.value.trim() }))
    const setDob = e => setFormData(prev => ({ ...prev, dob: e.target.value.trim() }))
    const setNationality = e => setFormData(prev => ({ ...prev, nationality: e.target.value.trim() }))
    const setStateOfOrigin = e => setFormData(prev => ({ ...prev, stateOfOrigin: e.target.value.trim() }))
    const setWard = e => setFormData(prev => ({ ...prev, ward: e.target.value.trim() }))
    const setSenetorialDistrict = e => setFormData(prev => ({ ...prev, senetorialDistrict: e.target.value.trim() }))
    const setHoaConstituency = e => setFormData(prev => ({ ...prev, hoaConstituency: e.target.value.trim() }))
    const setHorConstituency = e => setFormData(prev => ({ ...prev, horConstituency: e.target.value.trim() }))
    
    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true);
        
        if(formData.firstname !== "" && formData.lastname !== "" && formData.dob !== "" && formData.nin !== "" && formData.nationality !== "" && formData.stateOfOrigin !== "" && formData.lga !== "" && formData.ward !== "" && formData.senetorialDistrict !== "" && formData.hoaConstituency !== "" && formData.horConstituency !== ""){
            axios({
                method: "POST",
                url: REGISTER_VOTER,
                headers: {
                    "content-type": "application/json"
                },
                data: { formData }
            })
            .then(({data}) => {
                setLoading(false);
                let variant = "";
                if(data.success){
                    variant = "success";
                }else{
                    variant = "failure"
                }
                setMessage({
                    variant: variant,
                    message: data.message
                })
                resetState();
            })
            .catch(err => {
                setLoading(false);
                console.log(err)
            })
        }else{
            setLoading(false);
            setMessage({
                variant: 'failure',
                message: "Complete filling the form before submitting."
            })
        }
        
    }

    const fetchStates = () => {
        axios({
            method: 'GET',
            url: FETCH_STATES_ROUTE,
        })
        .then(({data}) => {
            if(data.success){
                let state = data.data.filter(item => {
                    if (item.alias === "kaduna") return true
                });
                state = state[0];
                let fetchedLgas = state.lgas;
                let fetchedStateConstituencies = state.stateConstituencies;
                let fetchedFederalConstituencies = state.federalConstituencies;
                let fetchedDistricts = state.senetorialDistricts;
                setLgas(fetchedLgas);
                setHoaConstituencies(fetchedStateConstituencies);
                setHorConstituencies(fetchedFederalConstituencies);
                setSenetorialDistricts(fetchedDistricts);
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
    useEffect(() => {
        fetchStates();
    }, [])
    
    return (
        <Container>
            <Row className = "justify-content-center">
                <Col md = {6}>
                    {message &&
                        <div 
                            className = {`alert m-4 p-4 text-center ${(message.variant === 'failure')?"alert-danger":"alert-success"}`}
                        >{message.message}</div>
                    }
                </Col>
            </Row>
            <Row className="justify-content-center my-4">
                <Col md = {6}>
                    <Form onSubmit = {handleSubmit}>
                        <Form.Group className = "my-3">
                            <Row>
                                <Col>
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control value = {formData.firstname} onChange = {setFirstname} type = "text" placeholder = "Enter Only First Name" />
                                </Col>
                                <Col>
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control value = {formData.lastname} onChange = {setLastname} type = "text" placeholder = "Last Name" />
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group className = "my-3">
                            <Form.Label>Date of birth</Form.Label>
                            <Form.Control value = {formData.dob} onChange = {setDob} type = "date" placeholder = "Date of birth" />
                        </Form.Group>
                        <Form.Group className = "my-3">
                            <Form.Label>NIN</Form.Label>
                            <Form.Control value = {formData.nin} className = {(ninMessage && ninEntered) ? (ninMessage.variant?"border-success": "border-danger") : ""} onBlur = {verifyNin} onChange = {setNin} type = "text" placeholder = "Enter your valid NIN" />
                            {ninMessage && <Form.Text >
                                <div className = {`${ninMessage.variant}?"text-success":"text-danger"`}>
                                    {ninMessage.message}
                                </div>
                            </Form.Text>}
                        </Form.Group>
                        <Form.Group className = "my-3">
                            <Form.Label>Nationality</Form.Label>
                            <Form.Control value = {formData.nationality} as = "select" onChange = {setNationality} className = "form-control">
                                <option value = "">--Select Country--</option>
                                <option value = "Nigeria">Nigeria</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className = "my-3">
                            <Form.Label>State of Origin</Form.Label>
                            <Form.Control value = {formData.stateOfOrigin} as = "select" onChange = {setStateOfOrigin} className = "form-control">
                                <option value = "">--Select State--</option>
                                <option value = "Kaduna">Kaduna</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className = "my-3">
                            <Form.Label>Local government area</Form.Label>
                            <Form.Control value = {formData.lga} as = "select" onChange = {setLga} className = "form-control">
                                <option value = "">--Select LGA--</option>
                                {lgas.map(item => <option key = {item.name} value = {item.name}>{item.name}</option>)}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className = "my-3">
                            <Form.Label>Ward</Form.Label>
                            <Form.Control value = {formData.ward} as = "select" onChange = {setWard} className = "form-control">
                                <option value = "">--Select Ward--</option>
                                {wards.map(item => <option key = {item} value = {item}>{item}</option>)}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className = "my-3">
                            <Form.Label>Senetorial District</Form.Label>
                            <Form.Control value = {formData.senetorialDistrict} as = "select" onChange = {setSenetorialDistrict} className = "form-control">
                                <option value = "">--Select District--</option>
                                {senetorialDistricts.map(item => <option key = {item.name} value = {item.name}>{item.name}</option>)}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className = "my-3">
                            <Form.Label>House of Assembly Constituency</Form.Label>
                            <Form.Control value = {formData.hoaConstituency} as = "select" onChange = {setHoaConstituency} className = "form-control">
                                <option value = "">--Select Constituency--</option>
                                {hoaConstituencies.map(item => <option key = {item.name} value = {item.name}>{item.name}</option>)}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className = "my-3">
                            <Form.Label>House of Representatives Constituency</Form.Label>
                            <Form.Control value = {formData.horConstituency} as = "select" onChange = {setHorConstituency} className = "form-control">
                                <option value = "">--Select Constituency--</option>
                                {horConstituencies.map(item => <option key = {item.name} value = {item.name}>{item.name}</option>)}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className = "my-3 text-center">
                            <Button type = "submit" variant = "default" className = "border" disabled = {(loading || !(ninEntered && ninVerified))} >
                                {loading?
                                    <Loading variant = "sm" />
                                :
                                    "Register"
                                }
                            </Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
            <Row className = "justify-content-center">
                <Col md = {6}>
                    {message &&
                        <div 
                            className = {`alert m-4 p-4 text-center ${(message.variant === 'failure')?"alert-danger":"alert-success"}`}
                        >{message.message}</div>
                    }
                </Col>
            </Row>
        </Container>
    )
}

export default RegisterAsVoter
