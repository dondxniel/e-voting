import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import LocalGovtElect from '../../presentational/admin/modals/LgElections/LgElectionsModal';
import StateElectionsModal from '../../presentational/admin/modals/StateElections/StateElectionsModal';
import FederalElectionsModal from '../../presentational/admin/modals/FederalElections/FederalElectionsModal';
import { FETCH_ELECTION_STATS } from '../../../constants/endpoints';
import Loading from '../../presentational/Loading';

const Home = () => {

    const [cookies] = useCookies(["adminToken", "adminType", "electionType", "adminState"]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(false);
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

    useEffect(() => {
        fetchElectionStats();
    }, [])

    return (
        <Container className = "admin-homepage">
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
                                    <LocalGovtElect result={localElectionResults} />
                                </Col>
                            }
                            {
                                (cookies['adminType'] === "super" || cookies['electionType'] === "state") &&
                                <Col md={3} >
                                    {/* See state govt. election results */}
                                    <StateElectionsModal result={stateElectionResults} />
                                </Col >
                            }
                            {
                                (cookies['adminType'] === "super" || cookies['electionType'] === "federal") &&
                                <Col md={3} >
                                    {/* See federal govt. election results */}
                                    <FederalElectionsModal result={federalElectionResults} />
                                </Col >
                            }
                        </Row>
                    }
                </>
            }
        </Container>
    )
}

export default Home
