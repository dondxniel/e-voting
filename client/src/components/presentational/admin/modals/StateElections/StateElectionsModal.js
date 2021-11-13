import { useState, useEffect } from 'react';
import { Modal, Button, Tabs, Tab, Container, Row } from 'react-bootstrap';
import { FaPrint } from 'react-icons/fa';
import Governorship from './presentational/Governorship';
import HouseOfAssembly from './presentational/HouseOfAssembly';
import Statistics from '../presentational/Statistics';
import { io } from 'socket.io-client';// socket.io importation
import { URL } from '../../../../../constants/socketUrl';

const socket = io();
// const socket = io(URL);

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

    const setSelectedHoaConstituencyFunc = e => {
        localStorage.setItem('selectedStateConstituency', e.target.value);
        setSelectedHoaConstituency(e.target.value);
        setHoaData(e);
    }

    const setSelectedStateFunc = e => {
        localStorage.setItem('selectedState', e.target.value);
        setGovernorshipData(e);
    }

    const resetState = () => {
        setStatLoading(false);
    }

    const setData = async () => {

        let gov = result.filter(item => item.electionType === 'governorship');
        let hoa = result.filter(item => item.electionType === 'hoa');

        gov = gov.length > 0 ? gov[0] : {};
        hoa = hoa.length > 0 ? hoa[0] : {};

        setGovernorship(gov);
        setHoa(hoa);
    }

    const setGovernorshipData = async e => {
        if (Object.keys(governorship).length !== 0) {
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
                        let pVoterTurnout = 0; // Percentage of voters that came to vote to the people that are eligible to vote.
                        if (totalVotesCast <= 0 || totalRegVoters <= 0) {
                            pVoterTurnout = 0;
                        } else {
                            pVoterTurnout = (100 * totalVotesCast) / totalRegVoters;
                        }

                        // calculating nVotesByParty
                        let nVotesByParty = [];
                        governorship.contestingParties.forEach(party => {
                            let partyName = party.party.abb;
                            let num = 0;
                            party.votes.forEach(vote => {
                                if (vote.stateOfOrigin === selectedState) {
                                    ++num
                                }
                            })
                            nVotesByParty.push({ party: partyName, num });
                        })

                        // calculating pVotesByParty
                        let pVotesByParty = [];
                        nVotesByParty.forEach(item => {
                            let percent = 0;
                            if (totalVotesCast <= 0 || item.num <= 0) {
                                percent = 0;
                            } else {
                                percent = (100 * totalVotesCast) / item.num;
                            }
                            pVotesByParty.push({ party: item.party, percent });
                        })

                        // calculating pVotesByGender
                        // Calculating number of male and female voters
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
                        //Calculating male pecentage
                        if (totalVotesCast <= 0 || maleVotes <= 0) {
                            maleVotes = 0;
                        } else {
                            maleVotes = (100 * totalVotesCast) / maleVotes;
                        }
                        //Calculating female pecentage
                        if (totalVotesCast <= 0 || femaleVotes <= 0) {
                            femaleVotes = 0;
                        } else {
                            femaleVotes = (100 * totalVotesCast) / femaleVotes;
                        }
                        let pVotesByGender = { male: maleVotes, female: femaleVotes };

                        let tempStats = {
                            location: selectedState,
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
                // alert("Sheeeeeee")
                setStats({
                    totalRegVoters: 0, totalVotesCast: 0, pVoterTurnout: 0,
                    nVotesByParty: [], pVotesByParty: [], pVotesByGender: { male: 0, female: 0 }
                })
            }
        }

    }

    const setHoaData = async e => {
        if (Object.keys(hoa).length !== 0) {
            setHoaStatsSet(false);
            let selectedStateConstituency = e.target.value;
            setSelectedHoaConstituency(selectedStateConstituency);
            if (selectedStateConstituency !== "") {
                if (Object.keys(hoa).length > 0) {
                    setStatLoading(true);

                    // getting totalRegVoters
                    let totalRegVoters = await hoaConstituencyNumRegisteredVoters(selectedStateConstituency);
                    console.log(totalRegVoters)
                    if (totalRegVoters.success === true) {
                        totalRegVoters = totalRegVoters.data;

                        totalRegVoters = parseInt(totalRegVoters);// Total number of people eligible to vote

                        // calculating totalVotesCast
                        let totalVotesCast = 0; // Total number of people that voted.
                        hoa.contestingParties.forEach(item => {
                            item.votes.forEach(voter => {
                                if (voter["hoaConstituency"] === selectedStateConstituency) {
                                    ++totalVotesCast;
                                }
                            })
                        })

                        // calculating pVoterTurnout
                        let pVoterTurnout = 0; // Percentage of voters that came to vote to the people that are eligible to vote.
                        if (totalVotesCast <= 0 || totalRegVoters <= 0) {
                            pVoterTurnout = 0;
                        } else {
                            pVoterTurnout = (100 * totalVotesCast) / totalRegVoters;
                        }

                        // calculating nVotesByParty
                        let nVotesByParty = [];
                        hoa.contestingParties.forEach(party => {
                            let partyName = party.party.abb;
                            let num = 0;
                            party.votes.forEach(vote => {
                                if (vote.hoaConstituency === selectedStateConstituency) {
                                    ++num
                                }
                            })
                            nVotesByParty.push({ party: partyName, num });
                        })

                        // calculating pVotesByParty
                        let pVotesByParty = [];
                        nVotesByParty.forEach(item => {
                            let percent = 0;
                            if (totalVotesCast <= 0 || item.num <= 0) {
                                percent = 0;
                            } else {
                                percent = (100 * totalVotesCast) / item.num;
                            }
                            pVotesByParty.push({ party: item.party, percent });
                        })

                        // calculating pVotesByGender
                        // Calculating number of male and female voters
                        let maleVotes = 0;
                        let femaleVotes = 0;
                        hoa.contestingParties.forEach(item => {
                            item.votes.forEach(voter => {
                                if (voter.gender === "Male") {
                                    ++maleVotes;
                                } else if (voter.gender === "Female") {
                                    ++femaleVotes;
                                }
                            })
                        })
                        //Calculating male pecentage
                        if (totalVotesCast <= 0 || maleVotes <= 0) {
                            maleVotes = 0;
                        } else {
                            maleVotes = (100 * totalVotesCast) / maleVotes;
                        }
                        //Calculating female pecentage
                        if (totalVotesCast <= 0 || femaleVotes <= 0) {
                            femaleVotes = 0;
                        } else {
                            femaleVotes = (100 * totalVotesCast) / femaleVotes;
                        }
                        let pVotesByGender = { male: maleVotes, female: femaleVotes };

                        let tempStats = {
                            location: selectedStateConstituency,
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
    }

    const updateGovernorshipData = async election => {
        let selectedState = localStorage.getItem('selectedState');
        if (selectedState !== "") {
            if (Object.keys(election).length > 0) {
                setStatLoading(true);

                // getting totalRegVoters
                let totalRegVoters = await stateNumRegisteredVoters();
                if (totalRegVoters.success === true) {
                    totalRegVoters = totalRegVoters.data;

                    totalRegVoters = parseInt(totalRegVoters);// Total number of people eligible to vote

                    // calculating totalVotesCast
                    let totalVotesCast = 0; // Total number of people that voted.
                    election.contestingParties.forEach(item => {
                        item.votes.forEach(voter => {
                            if (voter["stateOfOrigin"] === selectedState) {
                                ++totalVotesCast;
                            }
                        })
                    })

                    // calculating pVoterTurnout
                    let pVoterTurnout = 0; // Percentage of voters that came to vote to the people that are eligible to vote.
                    if (totalVotesCast <= 0 || totalRegVoters <= 0) {
                        pVoterTurnout = 0;
                    } else {
                        pVoterTurnout = (100 * totalVotesCast) / totalRegVoters;
                    }

                    // calculating nVotesByParty
                    let nVotesByParty = [];
                    election.contestingParties.forEach(party => {
                        let partyName = party.party.abb;
                        let num = 0;
                        party.votes.forEach(vote => {
                            if (vote.stateOfOrigin === selectedState) {
                                ++num
                            }
                        })
                        nVotesByParty.push({ party: partyName, num });
                    })

                    // calculating pVotesByParty
                    let pVotesByParty = [];
                    nVotesByParty.forEach(item => {
                        let percent = 0;
                        if (totalVotesCast <= 0 || item.num <= 0) {
                            percent = 0;
                        } else {
                            percent = (100 * totalVotesCast) / item.num;
                        }
                        pVotesByParty.push({ party: item.party, percent });
                    })

                    // calculating pVotesByGender
                    // Calculating number of male and female voters
                    let maleVotes = 0;
                    let femaleVotes = 0;
                    election.contestingParties.forEach(item => {
                        item.votes.forEach(voter => {
                            if (voter.gender === "Male") {
                                ++maleVotes;
                            } else if (voter.gender === "Female") {
                                ++femaleVotes;
                            }
                        })
                    })
                    //Calculating male pecentage
                    if (totalVotesCast <= 0 || maleVotes <= 0) {
                        maleVotes = 0;
                    } else {
                        maleVotes = (100 * totalVotesCast) / maleVotes;
                    }
                    //Calculating female pecentage
                    if (totalVotesCast <= 0 || femaleVotes <= 0) {
                        femaleVotes = 0;
                    } else {
                        femaleVotes = (100 * totalVotesCast) / femaleVotes;
                    }
                    let pVotesByGender = { male: maleVotes, female: femaleVotes };

                    let tempStats = {
                        location: selectedState,
                        totalRegVoters, totalVotesCast, pVoterTurnout, nVotesByParty, pVotesByParty, pVotesByGender
                    }

                    setStats(tempStats);
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

    const updateHoaData = async election => {
        let selectedStateConstituency = localStorage.getItem('selectedStateConstituency');
        if (selectedStateConstituency !== "") {
            if (Object.keys(election).length > 0) {
                setStatLoading(true);

                // getting totalRegVoters
                let totalRegVoters = await hoaConstituencyNumRegisteredVoters(selectedStateConstituency);
                console.log(totalRegVoters)
                if (totalRegVoters.success === true) {
                    totalRegVoters = totalRegVoters.data;

                    totalRegVoters = parseInt(totalRegVoters);// Total number of people eligible to vote

                    // calculating totalVotesCast
                    let totalVotesCast = 0; // Total number of people that voted.
                    election.contestingParties.forEach(item => {
                        item.votes.forEach(voter => {
                            if (voter["hoaConstituency"] === selectedStateConstituency) {
                                ++totalVotesCast;
                            }
                        })
                    })

                    // calculating pVoterTurnout
                    let pVoterTurnout = 0; // Percentage of voters that came to vote to the people that are eligible to vote.
                    if (totalVotesCast <= 0 || totalRegVoters <= 0) {
                        pVoterTurnout = 0;
                    } else {
                        pVoterTurnout = (100 * totalVotesCast) / totalRegVoters;
                    }

                    // calculating nVotesByParty
                    let nVotesByParty = [];
                    election.contestingParties.forEach(party => {
                        let partyName = party.party.abb;
                        let num = 0;
                        party.votes.forEach(vote => {
                            if (vote.hoaConstituency === selectedStateConstituency) {
                                ++num
                            }
                        })
                        nVotesByParty.push({ party: partyName, num });
                    })

                    // calculating pVotesByParty
                    let pVotesByParty = [];
                    nVotesByParty.forEach(item => {
                        let percent = 0;
                        if (totalVotesCast <= 0 || item.num <= 0) {
                            percent = 0;
                        } else {
                            percent = (100 * totalVotesCast) / item.num;
                        }
                        pVotesByParty.push({ party: item.party, percent });
                    })

                    // calculating pVotesByGender
                    // Calculating number of male and female voters
                    let maleVotes = 0;
                    let femaleVotes = 0;
                    election.contestingParties.forEach(item => {
                        item.votes.forEach(voter => {
                            if (voter.gender === "Male") {
                                ++maleVotes;
                            } else if (voter.gender === "Female") {
                                ++femaleVotes;
                            }
                        })
                    })
                    //Calculating male pecentage
                    if (totalVotesCast <= 0 || maleVotes <= 0) {
                        maleVotes = 0;
                    } else {
                        maleVotes = (100 * totalVotesCast) / maleVotes;
                    }
                    //Calculating female pecentage
                    if (totalVotesCast <= 0 || femaleVotes <= 0) {
                        femaleVotes = 0;
                    } else {
                        femaleVotes = (100 * totalVotesCast) / femaleVotes;
                    }
                    let pVotesByGender = { male: maleVotes, female: femaleVotes };

                    let tempStats = {
                        location: selectedStateConstituency,
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

    const updateStats = election => {
        // The payload contains an updated version of the election in which a vote was cast.
        if (election.electionType === "governorship") {
            // console.log("Governorship election updated");
            updateGovernorshipData(election);
        } else if (election.electionType === "hoa") {
            // console.log("House of assembly election updated");
            updateHoaData(election);
        }
    }

    useEffect(() => {
        setData();

        socket.on('vote_cast', updateStats);

        return () => {
            resetState();
            socket.off('vote_cast', updateStats);
        }
    }, [result, socket])

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
                                        setGovernorshipData={setSelectedStateFunc}
                                    >
                                        {govStatsSet ?
                                            <Statistics election={governorship} stats={stats} />
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
                                        setHoaData={setSelectedHoaConstituencyFunc}
                                        selectedHoaConstituency={selectedHoaConstituency}
                                    >
                                        {hoaStatsSet ?
                                            <Statistics election={hoa} stats={stats} />
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
