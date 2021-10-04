import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import LocalGovtElect from '../../presentational/admin/modals/LgElections/LgElectionsModal';
import StateElectionsModal from '../../presentational/admin/modals/StateElections/StateElectionsModal';
import FederalElectionsModal from '../../presentational/admin/modals/FederalElections/FederalElectionsModal';
import { FETCH_ELECTION_STATS, FETCH_STATES_ROUTE, FETCH_LGA_NUM_OF_REGISTERED_VOTERS, FETCH_WARD_NUM_OF_REGISTERED_VOTERS } from '../../../constants/endpoints';
import Loading from '../../presentational/Loading';

const Home = () => {

    const [cookies] = useCookies(["adminToken", "adminType", "electionType", "adminState"]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(false);

    // Local government election locations
    const [lgas, setLgas] = useState([]);
    const [wards, setWards] = useState([]);

    const [localElectionResults, setLocalElectionResults] = useState([]);
    const [stateElectionResults, setStateElectionResults] = useState([]);
    const [federalElectionResults, setFederalElectionResults] = useState([]);

    const fetchElectionStats = () => {
        setLoading(true);
        axios({
            method: 'GET',
            url: FETCH_ELECTION_STATS,
            headers: {
                "content-type": "application/json",
                'Authorization': `${cookies['adminToken']}`
            },
        })
            .then(({ data }) => {
                setLoading(false);
                // console.log(data.data.locals)
                if (data.success === true) {
                    setLocalElectionResults(data.data.locals);
                    setStateElectionResults(data.data.states);
                    setFederalElectionResults(data.data.federals);
                } else {
                    setMessage({
                        variant: false,
                        data: data.data,
                        message: data.message
                    })
                }
                // console.log(localElectionResults)
            })
            .catch(err => {
                setLoading(false);
                setMessage({
                    variant: false,
                    data: err,
                    message: "An Error occured while fetching the election results statistics."
                })
            })
    }

    const fetchLgas = () => {
        axios({
            method: 'GET',
            url: FETCH_STATES_ROUTE,
        })
            .then(({ data }) => {
                if (data.success) {
                    let kaduna = data.data.filter(item => {
                        if (item.alias === "kaduna") return true
                    });
                    let fetchedLgas = kaduna[0].lgas;
                    setLgas(fetchedLgas);
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
        try {
            let data = await axios({
                method: 'GET',
                url: `${FETCH_LGA_NUM_OF_REGISTERED_VOTERS}/${cookies['adminState']}/${lga}/${ward}`,
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
        // lgaNumRegisteredVoters();
        fetchElectionStats();
        fetchLgas();
    }, [])

    return (
        <Container className="admin-homepage">
            {loading ?
                <Loading variant="lg" />
                :
                <>
                    {message ?
                        <div className={`alert ${alert.variant ? 'alert-success' : 'alert-danger'}`}>
                            {message.message}
                        </div>
                        :
                        <Row className='my-5 justify-content-center'>
                            {
                                (cookies['adminType'] === "super") &&
                                <Col md={3}>
                                    {/* Select state */}
                                </Col>
                            }
                            {
                                (cookies['adminType'] === "super" || cookies['electionType'] === "local") &&
                                <Col md={3}>
                                    {/* See local govt. election results */}
                                    <LocalGovtElect
                                        result={localElectionResults}
                                        lgas={lgas}
                                        wards={wards}
                                        setWards={setWardsFunc}
                                        lgaNumRegisteredVoters={lgaNumRegisteredVoters}
                                        wardNumRegisteredVoters={wardNumRegisteredVoters}
                                    />
                                </Col>
                            }
                            {
                                (cookies['adminType'] === "super" || cookies['electionType'] === "state") &&
                                <Col md={3}>
                                    {/* See state govt. election results */}
                                    <StateElectionsModal result={stateElectionResults} />
                                </Col>
                            }
                            {
                                (cookies['adminType'] === "super" || cookies['electionType'] === "federal") &&
                                <Col md={3}>
                                    {/* See federal govt. election results */}
                                    <FederalElectionsModal result={federalElectionResults} />
                                </Col>
                            }
                        </Row>
                    }
                </>
            }
        </Container>
    )
}

export default Home
