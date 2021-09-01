import { useState, useEffect } from 'react';
import { Tab, Container, Row, Col } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { FETCH_PARTIES_ROUTE, FETCH_STATES_ROUTE }  from '../../../../../constants/endpoints';
import Pane1 from './panes/Pane1';
import Pane2 from './panes/Pane2';
import Pane3 from './panes/Pane3';
import Pane4 from './panes/Pane4';
import LoadingPane from '../LoadingPane';

const FederalGovt = ({state, startElection}) => {

    const [ cookies ]= useCookies(["adminToken"]);

    const [ key, setKey ] = useState('pane1');
    const [ approvedParties, setApprovedParties ] = useState([]);
    const [ consti, setConsti ] = useState([]);
    const [ districts, setDistricts ] = useState([]);
    const [ message, setMessage ] = useState(false);
    const [ saving, setSaving ] = useState(false);
    const [ formData, setFormData ] = useState({
        electionType: "",
        location: [],
        contestingParties: [],//{party: "", candidate: "", votes: []}
        electionDate: ""
    })  

    // Moving through panes
    const forwardToPane1 = () => {
        setKey('pane1');
        setMessage(false);
    }
    const forwardToPane2 = () => {
        if(formData.electionType === "" || formData.location.length === 0){
            alert("You have to finish filling the fields in the first pane before moving to the next.");
        }else{
            setKey('pane2');
        }
    }
    const forwardToPane3 = () => {
        if(formData.contestingParties.length === 0){
            alert("You have to select atlease one contesting party before moving to the next pane.");
        }else{
            setKey('pane3');
        }
    }
    const forwardToPane4 = () => {
        let forwardWorthy = true;
        formData.contestingParties.map(item => {if(item.candidate === "") forwardWorthy = false});
        if (forwardWorthy){
            setKey('pane4');
        }else{
            alert('You must finish filling the names for all the candidates before moving on to the next pane.')
        }
    }
    const handleSubmit = () => {
        setSaving(true);
        setKey("loadingPane");
        startElection(formData)
        .then(data => {
            setSaving(false)
            if(data.success){
                setMessage({
                    variant: 'success',
                    message: `The election has been successfully set for ${formData.electionDate}`
                })
            }else{
                setMessage({
                    variant: 'failure',
                    message: `${data.message}-${data.data.message}`
                })
            }
            resetFormData();
        })
        .catch(err => {
            setSaving(false)
            setMessage({
                variant: 'failure',
                message: `${err}`
            })
        })
    }
    const resetFormData = () => {
        setFormData({
            electionType: "",
            location: [],
            contestingParties: [],//{party: "", candidate: "", votes: []}
            electionDate: ""
        })  
    }

    // Filling the input fields
    const setElectionType = e => {

        let electionType = e.target.value;
        let location = [];
        if(electionType === "presidential"){
            location = ["Kaduna"]
        }
        setFormData(prev => {
            return {
                ...prev,
                location: location,
                electionType: electionType,
            }
        })
    }
    const setLocation = e => {
        let selected = [].slice.call(e.target.selectedOptions).map(item => item.value);
        if (selected.includes("all")) selected = ["all"];
        setFormData(prev => {
            return {
                ...prev,
                location: selected,
            }
        })
    }
    const setParty = e => {
        let selected = [].slice.call(e.target.selectedOptions).map(item => item.value);

        let selectedParties = approvedParties.filter(item => selected.includes(item._id));

        selected = selectedParties.map(item => ({party: item, candidate: "", votes: []}));
        
        setFormData(prev => {
            return {
                ...prev,
                contestingParties: selected
            }
        })
    }
    const setCandidate = e => {
        let targetParty = e.target.dataset.party;
        let contestingParties = formData.contestingParties;
        let withCandidates = contestingParties.map(item => {
            if(item.party._id == targetParty){
                item.candidate = e.target.value;
            }
            return item;
            
        }) 
        setFormData(prev => {
            return {
                ...prev, 
                contestingParties: withCandidates
            }
        })
    }
    const setDate = e => {
        setFormData(prev => {
            return {
                ...prev, 
                electionDate: e.target.value
            }
        })
    }
    const fetchParties = () => {
        console.log(cookies['adminToken']);
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
                setApprovedParties(data.data);
            }else{
                setMessage({
                    variant: 'failure',
                    message: `${data.message}`
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
    const fetchState = () => {
        axios({
            method: 'GET',
            url: FETCH_STATES_ROUTE,
        })
        .then(({data}) => {
            if(data.success){
                let kaduna = data.data.filter(item => {
                    if (item.alias === "kaduna") return true
                });
                kaduna = kaduna[0];
                let fetchedDistricts = kaduna.senetorialDistricts;
                let fetchedConsti = kaduna.federalConstituencies;
                setConsti(fetchedConsti);
                setDistricts(fetchedDistricts);
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
        fetchParties();
        fetchState();
    }, [])

    
    return (
        <Container className = 'my-5'>
            <Row className = 'justify-content-center text-center'>
                <h2>Start Election</h2>
            </Row>
            <Row>
                {message ? <div className = {`alert ${(message.variant === 'success')? 'alert-success' : ((message.variant === 'failure') && 'alert-danger')} text-center`}>{message.message}</div>:null}
            </Row>
            <Row className = 'justify-content-center'>
                <Col md = {6}>
                    <Tab.Container activeKey = {key}>
                        <Tab.Content>
                            <Tab.Pane eventKey = "pane1">
                                <Pane1 
                                    nextPane = {forwardToPane2}
                                    setElectionType = {setElectionType}
                                    setLocation = {setLocation}
                                    setMessage = {setMessage}
                                    location = {formData.location}
                                    consti = {consti}
                                    districts = {districts}
                                    electionType = {formData.electionType}
                                    state = {state}
                                />
                            </Tab.Pane>
                            <Tab.Pane eventKey = "pane2">
                                <Pane2 
                                    prevPane = {() => setKey('pane1')}
                                    nextPane = {forwardToPane3}
                                    setParty = {setParty}
                                    parties = {approvedParties}
                                />
                            </Tab.Pane>
                            <Tab.Pane eventKey = "pane3">
                                <Pane3
                                    prevPane = {() => setKey('pane2')}
                                    nextPane = {forwardToPane4}
                                    parties = {formData.contestingParties}
                                    setCandidate = {setCandidate}
                                />
                            </Tab.Pane>
                            <Tab.Pane eventKey = "pane4">
                                <Pane4 
                                    prevPane = {() => setKey('pane3')}
                                    nextPane = {handleSubmit}
                                    setDate = {setDate}
                                />
                            </Tab.Pane>
                            <Tab.Pane eventKey = "loadingPane">
                                <LoadingPane 
                                    saving = {saving}
                                    message = {message}
                                    startingPane = {forwardToPane1}
                                    date = {formData.electionDate}
                                />
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Col>
            </Row>
        </Container>
    )
}

export default FederalGovt
