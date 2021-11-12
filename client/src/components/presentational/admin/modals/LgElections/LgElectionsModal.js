import { useState, useEffect } from 'react';
import { Modal, Button, Tabs, Tab, Container, Row } from 'react-bootstrap';
import Chairmanship from './presentational/Chairmanship';
import Counsellorship from './presentational/Counsellorship';
import Statistics from '../presentational/Statistics';
import { io } from 'socket.io-client';// socket.io importation
import { URL } from '../../../../../constants/socketUrl';

const socket = io(URL);

const LgElectionsModal = ({ result, lgas, wards, setWards, lgaNumRegisteredVoters, wardNumRegisteredVoters }) => {

    const [show, setShow] = useState(false);
    const [chairmanship, setChairmanship] = useState({});
    const [counsellorship, setCounsellorship] = useState({});

    const [selectedLg, setSelectedLg] = useState("");
    const [selectedWard, setSelectedWard] = useState("");

    const [stats, setStats] = useState({
        totalRegVoters: 0, totalVotesCast: 0, pVoterTurnout: 0,
        nVotesByParty: [], pVotesByParty: [], pVotesByGender: { male: 0, female: 0 }
    })
    const [chairmanshipStatsSet, setCharimanshipStatsSet] = useState(false);
    const [counselorshipStatsSet, setCounselorshipStatsSet] = useState(false);
    const [statLoading, setStatLoading] = useState(false);

    const resetState = () => {
        // setShow(false);
        // setChairmanship({});
        // setCounsellorship({});
        // setSelectedLg("");
        // setSelectedWard("");
        // setStats({
        //     totalRegVoters: 0, totalVotesCast: 0, pVoterTurnout: 0,
        //     nVotesByParty: [], pVotesByParty: [], pVotesByGender: { male: 0, female: 0 }
        // });
        // setCharimanshipStatsSet(false);
        // setCounselorshipStatsSet(false);
        setStatLoading(false);
    }

    const setData = async passedResult => {
        let chair = passedResult.filter(item => item.electionType === 'chairmanship');
        let counsel = passedResult.filter(item => item.electionType === 'counselorship');

        chair = chair.length > 0 ? chair[0] : {}
        counsel = counsel.length > 0 ? counsel[0] : {}

        await setChairmanship(chair);
        await setCounsellorship(counsel);

    }

    const setSelectedLgFunc = e => {
        setSelectedLg(e.target.value);
        localStorage.setItem('selectedLg', e.target.value);
    };

    const setSelectedWardFunc = e => {
        setSelectedWard(e.target.value);
        localStorage.setItem('selectedWard', e.target.value);
        setCounselorshipData(e);
    };

    const lgSelected = e => {
        setSelectedLgFunc(e);
        setWards(e.target.value);
    }

    const setChairmanshipData = async e => {
        if (Object.keys(chairmanship).length !== 0) {
            setCharimanshipStatsSet(false);
            lgSelected(e)
            setStatLoading(true);
            let lga = e.target.value;

            // getting totalRegVoters
            let totalRegVoters = await lgaNumRegisteredVoters(lga);
            if (totalRegVoters.success === true) {
                totalRegVoters = totalRegVoters.data;

                totalRegVoters = parseInt(totalRegVoters);// Total number of people eligible to vote

                // calculating totalVotesCast
                let totalVotesCast = 0; // Total number of people that voted.
                chairmanship.contestingParties.forEach(item => {
                    item.votes.forEach(voter => {
                        if (voter["lga"] === lga) {
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
                chairmanship.contestingParties.forEach(party => {
                    let partyName = party.party.abb;
                    let num = 0;
                    party.votes.forEach(vote => {
                        if (vote.lga === e.target.value) {
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
                chairmanship.contestingParties.forEach(item => {
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
                    location: lga,
                    totalRegVoters, totalVotesCast, pVoterTurnout, nVotesByParty, pVotesByParty, pVotesByGender
                }

                setStats(tempStats)

                setCharimanshipStatsSet(true);
                setStatLoading(false);

            } else {
                alert("Error fetching total registered voters.");
            }
        }

    }

    const setCounselorshipData = async e => {
        if (Object.keys(counsellorship).length !== 0) {

            // console.log(`selected LG : ${selectedLg}`);
            // console.log(`selected Ward : ${e.target.value}`);


            setStatLoading(true);
            setCounselorshipStatsSet(false);
            // getting totalRegVoters
            let totalRegVoters = await wardNumRegisteredVoters(selectedLg, e.target.value);

            if (totalRegVoters.success === true) {
                totalRegVoters = totalRegVoters.data;

                totalRegVoters = parseInt(totalRegVoters);// Total number of people eligible to vote


                // calculating totalVotesCast
                let totalVotesCast = 0; // Total number of people that voted.

                counsellorship.contestingParties.forEach(item => {
                    item.votes.forEach(voter => {
                        if (voter["ward"] === e.target.value) {
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
                counsellorship.contestingParties.forEach(party => {
                    let partyName = party.party.abb;
                    let num = 0;
                    party.votes.forEach(vote => {
                        if (vote.lga === selectedLg && vote.ward === e.target.value) {
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
                counsellorship.contestingParties.forEach(item => {
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
                    location: e.target.value,
                    totalRegVoters, totalVotesCast, pVoterTurnout, nVotesByParty, pVotesByParty, pVotesByGender
                }

                setStats(tempStats)

                setCounselorshipStatsSet(true);
                setStatLoading(false);
            } else {
                alert("Error fetching total registered voters.");
            }
        }

    }

    const updateChairmanshipData = async election => {

        if (Object.keys(election).length !== 0) {

            let lga = localStorage.getItem('selectedLg');

            // getting totalRegVoters
            let totalRegVoters = await lgaNumRegisteredVoters(lga);
            if (totalRegVoters.success === true) {
                totalRegVoters = totalRegVoters.data;

                totalRegVoters = parseInt(totalRegVoters);// Total number of people eligible to vote

                // calculating totalVotesCast
                let totalVotesCast = 0; // Total number of people that voted.
                election.contestingParties.forEach(item => {
                    item.votes.forEach(voter => {
                        if (voter["lga"] === lga) {
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
                        if (vote.lga === lga) {
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
                    location: lga,
                    totalRegVoters, totalVotesCast, pVoterTurnout, nVotesByParty, pVotesByParty, pVotesByGender
                }

                setStats(tempStats);
            } else {
                alert("Error fetching total registered voters.");
            }
        }

    }

    const updateCounselorshipData = async election => {
        if (Object.keys(election).length !== 0) {

            let lga = localStorage.getItem('selectedLg');
            let ward = localStorage.getItem('selectedWard');

            // console.log(`selected LG : ${lga}`);
            // console.log(`selected Ward : ${ward}`);

            // getting totalRegVoters
            let totalRegVoters = await wardNumRegisteredVoters(lga, ward);
            // console.log(totalRegVoters) // undefined
            if (totalRegVoters.success === true) {
                totalRegVoters = totalRegVoters.data;

                totalRegVoters = parseInt(totalRegVoters);// Total number of people eligible to vote


                // calculating totalVotesCast
                let totalVotesCast = 0; // Total number of people that voted.

                election.contestingParties.forEach(item => {
                    item.votes.forEach(voter => {
                        if (voter["ward"] === ward) {
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
                        if (vote.lga === lga && vote.ward === ward) {
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
                    location: ward,
                    totalRegVoters, totalVotesCast, pVoterTurnout, nVotesByParty, pVotesByParty, pVotesByGender
                }

                setStats(tempStats);
            } else {
                alert("Error fetching total registered voters.");
            }
        }

    }

    const updateStats = election => {
        // The payload contains an updated version of the election in which a vote was cast.
        if (election.electionType === "chairmanship") {
            updateChairmanshipData(election);
        } else if (election.electionType === "counselorship") {
            updateCounselorshipData(election);
        }
    }

    useEffect(() => {
        setData(result);

        socket.on('vote_cast', updateStats)

        return () => {
            resetState();
            socket.off('vote_cast', updateStats)
        }
    }, [result, socket])

    return (
        <>
            <div className="py-4 text-center election-type-dropdown text-light rounded-pill bg-success" onClick={() => setShow(!show)}>
                LOCAL GOVT. ELECTIONS
            </div>
            <Modal
                show={show}
                onHide={() => setShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-center"
                centered
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Local Government Election results.
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center justify-content-center">
                    <Container>
                        <Row>
                            <Tabs defaultActiveKey="chairmanship" id="uncontrolled-tab-example" className="mb-3 text-center justify-content-center">
                                <Tab eventKey="chairmanship" title="Chairmanship">
                                    <Chairmanship
                                        data={chairmanship}
                                        lgas={lgas}
                                        setChairmanshipData={setChairmanshipData}
                                        selectedLg={selectedLg}
                                    >
                                        {chairmanshipStatsSet ?
                                            <Statistics election={chairmanship} stats={stats} />
                                            :
                                            <>
                                                {statLoading ?
                                                    <div className="p-3 m-3 alert alert-default text-center">Loading...</div>
                                                    :
                                                    <div className="p-3 m-3 alert alert-success     text-center">Select a location to see result statistics.</div>
                                                }
                                            </>
                                        }
                                    </Chairmanship>
                                </Tab>
                                <Tab eventKey="counsellorship" title="Counsellorship">
                                    <Counsellorship
                                        data={counsellorship}
                                        lgas={lgas}
                                        wards={wards}
                                        lgSelected={lgSelected}
                                        selectedLg={selectedLg}
                                        setSelectedWardFunc={setSelectedWardFunc}
                                        selectedWard={selectedWard}
                                    >
                                        {counselorshipStatsSet ?
                                            <Statistics election={counsellorship} stats={stats} />
                                            :
                                            <>
                                                {statLoading ?
                                                    <div className="p-3 m-3 alert alert-default text-center">Loading...</div>
                                                    :
                                                    <div className="p-3 m-3 alert alert-success text-center">Select a location to see result statistics.</div>
                                                }
                                            </>
                                        }
                                    </Counsellorship>
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

export default LgElectionsModal


// 1. set localStorage in setData() function.
// 2. got to setSelectedLg() and setSelectedWard() functions and set selected lg and ward to localStorage.