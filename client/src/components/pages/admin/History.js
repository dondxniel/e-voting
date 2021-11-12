import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Container, Row } from 'react-bootstrap';
import HistoryListItem from '../../presentational/admin/HistoryListItem';
import axios from 'axios';
import toTitleCase from '../../../functions/toTitleCase';
import Loading from '../../presentational/Loading';
import {
    FETCH_HISTORY,
    FETCH_STATE_NUM_OF_REGISTERED_VOTERS,
    FETCH_STATES_ROUTE,
    FETCH_HOR_NUM_OF_REGISTERED_VOTERS,
    FETCH_LGA_NUM_OF_REGISTERED_VOTERS,
    FETCH_WARD_NUM_OF_REGISTERED_VOTERS,
    FETCH_HOACONSTITUENCY_NUM_OF_REGISTERED_VOTERS,
    FETCH_SENETORIAL_NUM_OF_REGISTERED_VOTERS
} from '../../../constants/endpoints';

const History = () => {

    const [loading, setLoading] = useState(false);
    const [elections, setElections] = useState([]);
    const [message, setMessage] = useState(false);
    const [stateConstituencies, setStateConstituencies] = useState([]);
    const [lgas, setLgas] = useState([]);
    const [wards, setWards] = useState([]);
    const [senetorialDistricts, setSenetorialDistricts] = useState([]);
    const [federalConstituencies, setFederalConstituencies] = useState([]);

    const [cookies] = useCookies(['adminToken', 'adminState', 'electionType']);

    const setWardsFunc = lga => {
        let seekedWards = lgas.filter(item => item.name === lga);
        if (seekedWards.length > 0) {
            seekedWards = seekedWards[0].wards;
            setWards(seekedWards);
        } else if (seekedWards.length <= 0) {
            alert("Unknown Local Government Area selected.");
        } else if (seekedWards.length > 1) {
            alert("Error occured as more than one Local government areas have been found with this name.");
        }
    }

    const fetchHistory = () => {
        setLoading(true);
        axios({
            method: "GET",
            url: FETCH_HISTORY,
            headers: {
                "content-type": "application/json",
                "Authorization": `${cookies['adminToken']}`
            }
        })
            .then(({ data }) => {
                console.log("Result returned");
                setElections(data.data);
                setLoading(false);
            })
            .catch(err => {
                console.log("Error caught");
                setMessage({
                    variant: false,
                    data: err,
                    message: "Error in fetching elections."
                })
                setLoading(false);
            })
    }

    const fetchLocations = () => {
        axios({
            method: 'GET',
            url: FETCH_STATES_ROUTE,
        })
            .then(({ data }) => {
                if (data.success) {
                    let kaduna = data.data.filter(item => {
                        if (item.alias === "kaduna") return true
                    });
                    kaduna = kaduna[0];
                    let fetchedLgas = kaduna.lgas;
                    let fetchedStateConstituencies = kaduna.stateConstituencies;
                    let fetchedSenetorialDistricts = kaduna.senetorialDistricts;
                    let fetchedFederalConstituencies = kaduna.federalConstituencies;
                    setStateConstituencies(fetchedStateConstituencies);
                    setLgas(fetchedLgas);
                    setSenetorialDistricts(fetchedSenetorialDistricts);
                    setFederalConstituencies(fetchedFederalConstituencies);
                } else {
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

    const stateNumRegisteredVoters = async () => {
        try {
            let data = await axios({
                method: 'GET',
                url: `${FETCH_STATE_NUM_OF_REGISTERED_VOTERS}/${cookies['adminState']}`,
                headers: {
                    "content-type": "application/json",
                    'Authorization': `${cookies['adminToken']}`
                },
            })
            if (data.data.success) {
                return data.data;
            } else {
                setMessage({
                    variant: 'failure',
                    message: data.message
                })
            }
        } catch (err) {
            setMessage({
                variant: 'failure',
                message: `${err}`
            })
        }
    }

    const horNumRegisteredVoters = async horConstituency => {
        try {
            let data = await axios({
                method: 'GET',
                url: `${FETCH_HOR_NUM_OF_REGISTERED_VOTERS}/${cookies['adminState']}/${horConstituency}`,
                headers: {
                    "content-type": "application/json",
                    'Authorization': `${cookies['adminToken']}`
                },
            })
            if (data.data.success) {
                // console.log(data.data)
                return data.data;
            } else {
                setMessage({
                    variant: 'failure',
                    message: data.message
                })
            }
        } catch (err) {
            setMessage({
                variant: 'failure',
                message: `${err}`
            })
        }
    }

    const lgaNumRegisteredVoters = async (lga) => {
        try {
            let data = await axios({
                method: 'GET',
                url: `${FETCH_LGA_NUM_OF_REGISTERED_VOTERS}/${cookies['adminState']}/${lga}`,
                headers: {
                    "content-type": "application/json",
                    'Authorization': `${cookies['adminToken']}`
                },
            })
            if (data.data.success) {
                return data.data;
            } else {
                setMessage({
                    variant: 'failure',
                    message: data.message
                })
            }
        } catch (err) {
            setMessage({
                variant: 'failure',
                message: `${err}`
            })
        }
    }

    const wardNumRegisteredVoters = async (lga, ward) => {
        console.log(`State: ${cookies['adminState']}`);
        console.log(`LGA: ${lga}`);
        console.log(`Ward: ${ward}`);
        try {
            let data = await axios({
                method: 'GET',
                url: `${FETCH_WARD_NUM_OF_REGISTERED_VOTERS}/${cookies['adminState']}/${lga}/${ward}`,
                headers: {
                    "content-type": "application/json",
                    'Authorization': `${cookies['adminToken']}`
                },
            })
            if (data.data.success) {
                return data.data;
            } else {
                setMessage({
                    variant: 'failure',
                    message: data.message
                })
            }
        } catch (err) {
            setMessage({
                variant: 'failure',
                message: `${err}`
            })
        }
    }

    const hoaConstituencyNumRegisteredVoters = async hoaConstituency => {
        try {
            let data = await axios({
                method: 'GET',
                url: `${FETCH_HOACONSTITUENCY_NUM_OF_REGISTERED_VOTERS}/${cookies['adminState']}/${hoaConstituency}`,
                headers: {
                    "content-type": "application/json",
                    'Authorization': `${cookies['adminToken']}`
                },
            })
            if (data.data.success) {
                return data.data;
            } else {
                setMessage({
                    variant: 'failure',
                    message: data.message
                })
            }
        } catch (err) {
            setMessage({
                variant: 'failure',
                message: `${err}`
            })
        }
    }

    const senetorialNumRegisteredVoters = async district => {
        try {
            let data = await axios({
                method: 'GET',
                url: `${FETCH_SENETORIAL_NUM_OF_REGISTERED_VOTERS}/${cookies['adminState']}/${district}`,
                headers: {
                    "content-type": "application/json",
                    'Authorization': `${cookies['adminToken']}`
                },
            })
            if (data.data.success) {
                return data.data;
            } else {
                setMessage({
                    variant: 'failure',
                    message: data.message
                })
            }
        } catch (err) {
            setMessage({
                variant: 'failure',
                message: `${err}`
            })
        }
    }

    useEffect(() => {
        fetchHistory();
        fetchLocations();
    }, [])

    return (
        <div className="admin-homepage mt-5">
            <Container>
                <Row>
                    <h1 className="text-center"> History </h1>
                </Row>
                {loading ?
                    <Loading variant="lg" />
                    :
                    <>
                        {message ?
                            <Row>
                                <div className={`alert ${message.variant ? 'alert-success' : 'alert-danger'} `} >
                                    {message.message}
                                </div>
                            </Row>
                            :
                            <Row>
                                {elections.map((item, index) => {
                                    let electionType = item.electionType;
                                    electionType = electionType === "hor" ? "House of representatives" : electionType;
                                    electionType = electionType === "hoa" ? "House of assembly" : electionType;
                                    electionType = toTitleCase(electionType);

                                    if (item.admin.electionType === cookies["electionType"] || cookies["adminType"] === "super") {
                                        return (
                                            <HistoryListItem
                                                key={index}
                                                election={item}
                                                electionType={electionType + " elections"}
                                                date={item.electionDate}
                                                state={cookies['adminState']}
                                                stateNumRegisteredVoters={stateNumRegisteredVoters}
                                                horNumRegisteredVoters={horNumRegisteredVoters}
                                                lgaNumRegisteredVoters={lgaNumRegisteredVoters}
                                                wardNumRegisteredVoters={wardNumRegisteredVoters}
                                                hoaConstituencyNumRegisteredVoters={hoaConstituencyNumRegisteredVoters}
                                                senetorialNumRegisteredVoters={senetorialNumRegisteredVoters}

                                                federalConstituencies={federalConstituencies}
                                                stateConstituencies={stateConstituencies}
                                                lgas={lgas}
                                                wards={wards}
                                                senetorialDistricts={senetorialDistricts}

                                                setWards={setWardsFunc}
                                            />
                                        )
                                    }
                                })
                                }
                            </Row>
                        }
                    </>
                }
            </Container>
        </div>
    )
}

export default History;