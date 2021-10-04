import { useState, useEffect } from 'react';
import { Modal, Button, Tabs, Tab, Container, Row } from 'react-bootstrap';
import { FaPrint } from 'react-icons/fa';
import Chairmanship from './presentational/Chairmanship';
import Counsellorship from './presentational/Counsellorship';
import Statistics from '../presentational/Statistics';

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
    const [statsSet, setStatsSet] = useState(false);
    const [statLoading, setStatLoading] = useState(false);

    const setData = () => {
        // console.log(result);
        let chair = result.filter(item => item.electionType === 'chairmanship');
        let counsel = result.filter(item => item.electionType === 'counselorship');

        chair = chair.length > 0 ? chair[0] : false
        counsel = counsel.length > 0 ? counsel[0] : false

        setChairmanship(chair);
        setCounsellorship(counsel);
    }

    const setSelectedLgFunc = e => setSelectedLg(e.target.value);

    const setSelectedWardFunc = e => {
        setSelectedWard(e.target.value);
        setCounselorshipData(e);
    };

    const lgSelected = e => {
        setSelectedLgFunc(e);
        setWards(e.target.value);
    }

    const setCharimanshipData = async e => {
        setSelectedLgFunc(e)
        setStatLoading(true);
        let locationType = "lga";
        let location = e.target.value;
        // console.log(locationType, location)

        // getting totalRegVoters
        let totalRegVoters = await lgaNumRegisteredVoters(locationType, location);
        console.log('Before conversion: ', totalRegVoters.data)
        if (totalRegVoters.success === true) {
            totalRegVoters = totalRegVoters.data;

            totalRegVoters = parseInt(totalRegVoters);// Total number of people eligible to vote
            console.log('After conversion: ', totalRegVoters)


            // calculating totalVotesCast
            let totalVotesCast = 0; // Total number of people that voted.
            // console.log(chairmanship);
            chairmanship.contestingParties.forEach(item => {
                item.votes.forEach(voter => {
                    if (voter[locationType] === location) {
                        ++totalVotesCast;
                    }
                })
            })

            // calculating pVoterTurnout
            let pVoterTurnout = (100 * totalVotesCast) / totalRegVoters // Percentage of voters that came to vote to the people that are eligible to vote.

            // calculating nVotesByParty
            let nVotesByParty = [];
            chairmanship.contestingParties.forEach(party => {
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
            chairmanship.contestingParties.forEach(item => {
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

            // console.log({
            //     totalRegVoters, totalVotesCast, pVoterTurnout, nVotesByParty, pVotesByParty, pVotesByGender
            // })
            let tempStats = {
                totalRegVoters, totalVotesCast, pVoterTurnout, nVotesByParty, pVotesByParty, pVotesByGender
            }

            // console.log(tempStats)
            setStats(tempStats)

            setStatsSet(true);
            setStatLoading(false);
            // {
            //     totalRegVoters: 0, totalVotesCast: 0, pVoterTurnout: 0,
            //     nVotesByParty: [], pVotesByParty: [], pVotesByGender: { male: 0, female: 0 }
            // }

        } else {
            alert("Error fetching total registered voters.");
        }

    }

    const setCounselorshipData = async e => {
        setStatLoading(true);

        // getting totalRegVoters
        let totalRegVoters = await wardNumRegisteredVoters(selectedLg, selectedWard);

        if (totalRegVoters.success === true) {
            totalRegVoters = totalRegVoters.data;

            totalRegVoters = parseInt(totalRegVoters);// Total number of people eligible to vote
            console.log('After conversion: ', totalRegVoters)


            // calculating totalVotesCast
            let totalVotesCast = 0; // Total number of people that voted.
            // console.log(chairmanship);
            chairmanship.contestingParties.forEach(item => {
                item.votes.forEach(voter => {
                    if (voter["ward"] === selectedWard) {
                        ++totalVotesCast;
                    }
                })
            })

            // calculating pVoterTurnout
            let pVoterTurnout = (100 * totalVotesCast) / totalRegVoters // Percentage of voters that came to vote to the people that are eligible to vote.

            // calculating nVotesByParty
            let nVotesByParty = [];
            chairmanship.contestingParties.forEach(party => {
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
            chairmanship.contestingParties.forEach(item => {
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

            setStatsSet(true);
            setStatLoading(false);
        } else {
            alert("Error fetching total registered voters.");
        }

    }


    useEffect(() => {
        setData();
    }, [result])

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
                                        setCharimanshipData={setCharimanshipData}
                                        selectedLg={selectedLg}
                                    >
                                        {statsSet ?
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
                                    </Chairmanship>
                                </Tab>
                                <Tab eventKey="counsellorship" title="Counsellorship">
                                    <Counsellorship
                                        data={counsellorship}
                                        lgas={lgas}
                                        wards={wards}
                                        // setSelectedLgFunc={setSelectedLgFunc}
                                        lgSelected={lgSelected}
                                        selectedLg={selectedLg}
                                        setSelectedWardFunc={setSelectedWardFunc}
                                        selectedWard={selectedWard}
                                    >
                                        {statsSet ?
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
                                    </Counsellorship>
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

export default LgElectionsModal
