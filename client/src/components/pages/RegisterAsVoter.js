import { useState, useEffect } from 'react';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import Loading from '../presentational/Loading.js';
import axios from 'axios';
import { REGISTER_VOTER, FETCH_STATES_ROUTE } from '../../constants/endpoints';

const RegisterAsVoter = () => {

    const [ formData, setFormData ] = useState({
        firstname: "", lastname: "", phoneNumber: "",
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
    const [phoneNumberVerified, setPhoneNumberVerified] = useState(null);
    const [phoneNumberMessage, setPhoneNumberMessage] = useState(false);

    const resetState = () => {
        setFormData({
            firstname: "", lastname: "", phoneNumber: "", dob: "", nin: "", nationality: "", stateOfOrigin: "", lga: "", ward: "", senetorialDistrict: "", hoaConstituency: "", horConstituency: ""
        })
    }

    const verifyNin = e => {
        let nin = e.target.value.trim();
        if (nin !== "") {
            // var regExp = /[a-zA-Z]/g; //Checking for letters
            var regExp = /^\d+$/;

            if (regExp.test(nin)) {
                // do something if only numbers are not found in your string 
                setFormData(prev => ({ ...prev, phoneNumber: "09023830868" }));
                setNinVerified(true);
                setNinMessage({
                    variant: true,
                    message: "NIN valid."
                })
                setPhoneNumberMessage({
                    variant: false,
                    message: "Note that this is the only number you can use to vote and it was automatically fetched from your NIN registration data. Edit it if you don't have access to this sim anymore."
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
    }

    const verifyPhoneNumber = e => {
        let number = e.target.value.trim();

        if (number !== "") {
            number = number.split("");
            if (number[0] !== "0" && (`${number[0]}${number[1]}${number[2]}${number[3]}` !== "+234")) {
                //do something if the first character is not "0" and the first 4 characters is not "+234"
                setPhoneNumberVerified(false);
                setPhoneNumberMessage({
                    variant: false,
                    message: "Your number is not understood by our system. Please make sure it either starts with a '0' or '+234'."
                })
            } else {
                if ((number[0] === "0" && number.length !== 11) || (`${number[0]}${number[1]}${number[2]}${number[3]}` === "+234" && number.length !== 14)) {
                    //do something if the first character is "0" but the characters count is not equals to 11 or the first 4 characters is "+234" and the characters count is not equals to 14
                    setPhoneNumberVerified(false);
                    setPhoneNumberMessage({
                        variant: false,
                        message: "Your number is not understood by our system. If it starts with '0', please make sure it is 11 characters. If it starts with '+234' please make sure it is 14 characters."
                    })
                } else {
                    // do something if the phone number passes all the checks.
                    number = number.join("");
                    // var regExp = /[a-zA-Z]/g; //Checking for letters
                    // var regExp = /^\d+$/; //Checking for numbers
                    var regExp = /^[\d\+]+$/
                    if (regExp.test(number)) {
                        // do something if only numbers are not found in your string 
                        setPhoneNumberVerified(true);
                        setPhoneNumberMessage({
                            variant: true,
                            message: "Phone number valid."
                        })
                    } else {
                        //do something if letters or special characters are found in your string 
                        setPhoneNumberVerified(false);
                        setPhoneNumberMessage({
                            variant: false,
                            message: "You are only allowed to enter numbers and '+' sign as part of your phone number."
                        })
                    }
                }
            }
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
    const setPhoneNumber = e => setFormData(prev => ({ ...prev, phoneNumber: e.target.value.trim() }))
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
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control value={formData.phoneNumber} className={(phoneNumberVerified !== null) ? (phoneNumberVerified ? "border-success" : "border-danger") : ""} onBlur={verifyPhoneNumber} onChange={setPhoneNumber} type="text" placeholder="Enter the phone number you're currently using." />
                            {phoneNumberMessage && <Form.Text >
                                <div className={`${phoneNumberMessage.variant}?"text-success":"text-danger"`}>
                                    {phoneNumberMessage.message}
                                </div>
                            </Form.Text>}
                        </Form.Group>
                        <Form.Group className="my-3">
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
                            <Button type="submit" variant="default" className="border" disabled={(loading || !(ninEntered && ninVerified && phoneNumberVerified))} >
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
