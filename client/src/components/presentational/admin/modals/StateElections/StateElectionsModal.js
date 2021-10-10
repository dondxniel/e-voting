import { useState, useEffect } from 'react';
import { Modal, Button, Tabs, Tab, Container, Row } from 'react-bootstrap';
import { FaPrint } from 'react-icons/fa';
import Governorship from './presentational/Governorship';
import HouseOfAssembly from './presentational/HouseOfAssembly';
import Statistics from '../presentational/Statistics';

const StateElectionsModal = ({ result, state, stateConstituencies, stateNumRegisteredVoters, hoaConstituencyNumRegisteredVoters }) => {

    const [show, setShow] = useState(false);

    const [governorship, setGovernorship] = useState({});
    const [hoa, setHoa] = useState({});

    const [stats, setStats] = useState({
        totalRegVoters: 0, totalVotesCast: 0, pVoterTurnout: 0,
        nVotesByParty: [], pVotesByParty: [], pVotesByGender: { male: 0, female: 0 }
    })
    const [govStatsSet, setGovStatsSet] = useState(false);
    const [hoaStatsSet, setHoaStatsSet] = useState(false);
    const [statLoading, setStatLoading] = useState(false);

    const [selectedHoaConstituency, setSelectedHoaConstituency] = useState("");

    const setGovernorshipData = async e => {
        setGovStatsSet(false);
        let selectedState = e.target.value;
        if (selectedState !== "") {
            if (Object.keys(governorship).length > 0) {
                setStatLoading(true);

                // getting totalRegVoters
                let totalRegVoters = await stateNumRegisteredVoters();
                if (totalRegVoters.success === true) {
                    totalRegVoters = totalRegVoters.data;

                    totalRegVoters = parseInt(totalRegVoters);// Total number of people eligible to vote

                    // calculating totalVotesCast
                    let totalVotesCast = 0; // Total number of people that voted.
                    governorship.contestingParties.forEach(item => {
                        item.votes.forEach(voter => {
                            if (voter["stateOfOrigin"] === selectedState) {
                                ++totalVotesCast;
                            }
                        })
                    })

                    // calculating pVoterTurnout
                    let pVoterTurnout = (100 * totalVotesCast) / totalRegVoters // Percentage of voters that came to vote to the people that are eligible to vote.

                    // calculating nVotesByParty
                    let nVotesByParty = [];
                    governorship.contestingParties.forEach(party => {
                        let partyName = party.party.abb;
                        let num = party.votes.length;
                        nVotesByParty.push({ party: partyName, num });
                    })

                    // calculating pVotesByParty
                    let pVotesByParty = [];
                    nVotesByParty.forEach(item => {
                        let percent = (totalVotesCast > 0) ? ((100 * totalVotesCast) / item.num) : 0;
                        pVotesByParty.push({ party: item.party, percent });
                    })

                    // calculating pVotesByGender
                    let maleVotes = 0;
                    let femaleVotes = 0;
                    governorship.contestingParties.forEach(item => {
                        item.votes.forEach(voter => {
                            if (voter.gender === "Male") {
                                ++maleVotes;
                            } else if (voter.gender === "Female") {
                                ++femaleVotes;
                            }
                        })
                    })
                    maleVotes = (totalVotesCast > 0) ? ((100 * totalVotesCast) / maleVotes) : 0;
                    femaleVotes = (totalVotesCast > 0) ? ((100 * totalVotesCast) / femaleVotes) : 0;
                    let pVotesByGender = { male: maleVotes, female: femaleVotes };

                    let tempStats = {
                        totalRegVoters, totalVotesCast, pVoterTurnout, nVotesByParty, pVotesByParty, pVotesByGender
                    }

                    setStats(tempStats)

                    setGovStatsSet(true);
                    setStatLoading(false);

                } else {
                    alert("Error fetching total registered voters.");
                }
            }
        } else {
            setStats({
                totalRegVoters: 0, totalVotesCast: 0, pVoterTurnout: 0,
                nVotesByParty: [], pVotesByParty: [], pVotesByGender: { male: 0, female: 0 }
            })
        }
    }

    const setHoaData = async e => {
        setHoaStatsSet(false);
        let selectedStateConstituency = e.target.value;
        setSelectedHoaConstituency(selectedStateConstituency);
        if (selectedStateConstituency !== "") {
            if (Object.keys(governorship).length > 0) {
                setStatLoading(true);

                // getting totalRegVoters
                let totalRegVoters = await hoaConstituencyNumRegisteredVoters(selectedStateConstituency);
                console.log(totalRegVoters)
                if (totalRegVoters.success === true) {
                    totalRegVoters = totalRegVoters.data;

                    totalRegVoters = parseInt(totalRegVoters);// Total number of people eligible to vote

                    // calculating totalVotesCast
                    let totalVotesCast = 0; // Total number of people that voted.
                    governorship.contestingParties.forEach(item => {
                        item.votes.forEach(voter => {
                            if (voter["hoaConstituency"] === selectedStateConstituency) {
                                ++totalVotesCast;
                            }
                        })
                    })

                    // calculating pVoterTurnout
                    let pVoterTurnout = (100 * totalVotesCast) / totalRegVoters // Percentage of voters that came to vote to the people that are eligible to vote.

                    // calculating nVotesByParty
                    let nVotesByParty = [];
                    governorship.contestingParties.forEach(party => {
                        let partyName = party.party.abb;
                        let num = party.votes.length;
                        nVotesByParty.push({ party: partyName, num });
                    })

                    // calculating pVotesByParty
                    let pVotesByParty = [];
                    nVotesByParty.forEach(item => {
                        let percent = (totalVotesCast > 0) ? ((100 * totalVotesCast) / item.num) : 0;
                        pVotesByParty.push({ party: item.party, percent });
                    })

                    // calculating pVotesByGender
                    let maleVotes = 0;
                    let femaleVotes = 0;
                    governorship.contestingParties.forEach(item => {
                        item.votes.forEach(voter => {
                            if (voter.gender === "Male") {
                                ++maleVotes;
                            } else if (voter.gender === "Female") {
                                ++femaleVotes;
                            }
                        })
                    })
                    maleVotes = (totalVotesCast > 0) ? ((100 * totalVotesCast) / maleVotes) : 0;
                    femaleVotes = (totalVotesCast > 0) ? ((100 * totalVotesCast) / femaleVotes) : 0;
                    let pVotesByGender = { male: maleVotes, female: femaleVotes };

                    let tempStats = {
                        totalRegVoters, totalVotesCast, pVoterTurnout, nVotesByParty, pVotesByParty, pVotesByGender
                    }

                    setStats(tempStats)

                    setHoaStatsSet(true);
                    setStatLoading(false);

                } else {
                    alert("Error fetching total registered voters.");
                }
            }
        } else {
            setStats({
                totalRegVoters: 0, totalVotesCast: 0, pVoterTurnout: 0,
                nVotesByParty: [], pVotesByParty: [], pVotesByGender: { male: 0, female: 0 }
            })
        }
    }

    const setData = async () => {

        let gov = result.filter(item => item.electionType === 'governorship');
        let hoa = result.filter(item => item.electionType === 'hoa');

        gov = gov.length > 0 ? gov[0] : false;
        hoa = hoa.length > 0 ? hoa[0] : false;

        setGovernorship(gov);
        setHoa(hoa);
    }

    useEffect(() => {
        setData();
    }, [result])

    return (
        <>
            <div className="py-4 text-center election-type-dropdown text-light rounded-pill bg-success" onClick={() => setShow(!show)}>
                STATE GOVT. ELECTIONS
            </div>
            <Modal
                show={show}
                onHide={() => setShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        State Election results.
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center justify-content-center">
                    <Container>
                        <Row>
                            <Tabs defaultActiveKey="gov" id="uncontrolled-tab-example" className="mb-3 text-center justify-content-center">
                                <Tab eventKey="gov" title="Governorship">
                                    <Governorship
                                        data={governorship}
                                        state={state}
                                        setGovernorshipData={setGovernorshipData}
                                    >
                                        {govStatsSet ?
                                            <Statistics stats={stats} />
                                            :
                                            <>
                                                {statLoading ?
                                                    <div className="p-3 m-3 alert alert-default text-center">Loading...</div>
                                                    :
                                                    <div className="p-3 m-3 alert alert-success text-center">Select a location to see result statistics.</div>
                                                }
                                            </>
                                        }
                                    </Governorship>
                                </Tab>
                                <Tab eventKey="hoa" title="House of Assembly">
                                    <HouseOfAssembly
                                        data={hoa}
                                        state={state}
                                        stateConstituencies={stateConstituencies}
                                        setHoaData={setHoaData}
                                        selectedHoaConstituency={selectedHoaConstituency}
                                    >
                                        {hoaStatsSet ?
                                            <Statistics stats={stats} />
                                            :
                                            <>
                                                {statLoading ?
                                                    <div className="p-3 m-3 alert alert-default text-center">Loading...</div>
                                                    :
                                                    <div className="p-3 m-3 alert alert-success text-center">Select a location to see result statistics.</div>
                                                }
                                            </>
                                        }
                                    </HouseOfAssembly>
                                </Tab>
                            </Tabs>
                        </Row>
                        <Row className="justify-content-center text-center">
                            <Button variant="success">
                                <h1>
                                    <FaPrint />
                                </h1>
                                Print
                            </Button>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShow(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default StateElectionsModal
