import { useState, useEffect } from 'react';
import { Modal, Button, Tabs, Tab, Container, Row } from 'react-bootstrap';
import { FaPrint } from 'react-icons/fa';
import Presedential from './presentational/Presedential';
import Senetorial from './presentational/Senetorial';
import HouseOfRepresentative from './presentational/HouseOfRepresentative';
import Statistics from '../presentational/Statistics';
import { io } from 'socket.io-client';// socket.io importation
import { URL } from '../../../../../constants/socketUrl';

const socket = io();
// const socket = io(URL);

const FederalElectionsModal = ({ result, state, senetorialDistricts, stateNumRegisteredVoters, senetorialNumRegisteredVoters, horNumRegisteredVoters, federalConstituencies }) => {

    const [show, setShow] = useState(false);

    const [presidential, setPresidential] = useState({});
    const [senetorial, setSenetorial] = useState({});
    const [hor, setHor] = useState({});

    const [stats, setStats] = useState({
        totalRegVoters: 0, totalVotesCast: 0, pVoterTurnout: 0,
        nVotesByParty: [], pVotesByParty: [], pVotesByGender: { male: 0, female: 0 }
    })
    const [presStatsSet, setPresStatsSet] = useState(false);
    const [senStatsSet, setSenStatsSet] = useState(false);
    const [horStatsSet, setHorStatsSet] = useState(false);
    const [statLoading, setStatLoading] = useState(false);

    const resetState = () => {
        setStatLoading(false);
    }

    const stateSelected = e => {
        localStorage.setItem('selectedState', e.target.value);
        setPresidentialData(e);
    }

    const districtSelected = e => {
        localStorage.setItem('selectedDistrict', e.target.value);
        setSenetorialData(e);
    }

    const constituencySelected = e => {
        localStorage.setItem('selectedConstituency', e.target.value);
        setHorData(e);
    }

    const setData = async () => {
        // console.log("REsult", result);
        let pres = result.filter(item => item.electionType === 'presidential');
        let sen = result.filter(item => item.electionType === 'senetorial');
        let hor = result.filter(item => item.electionType === 'hor');
        // console.log("Pres", pres);

        pres = pres.length > 0 ? pres[0] : false;
        sen = sen.length > 0 ? sen[0] : false;
        hor = hor.length > 0 ? hor[0] : false;

        await setPresidential(pres);
        await setSenetorial(sen);
        await setHor(hor);
    }

    const setPresidentialData = async e => {
        setPresStatsSet(false);
        let selectedState = e.target.value;
        if (selectedState !== "") {
            if (Object.keys(presidential).length > 0) {
                setStatLoading(true);

                // getting totalRegVoters
                let totalRegVoters = await stateNumRegisteredVoters();
                if (totalRegVoters.success === true) {
                    totalRegVoters = totalRegVoters.data;

                    totalRegVoters = parseInt(totalRegVoters);// Total number of people eligible to vote

                    // calculating totalVotesCast
                    let totalVotesCast = 0; // Total number of people that voted.
                    presidential.contestingParties.forEach(item => {
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
                    presidential.contestingParties.forEach(party => {
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
                    presidential.contestingParties.forEach(item => {
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

                    setPresStatsSet(true);
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

    const setSenetorialData = async e => {
        setSenStatsSet(false);
        let selectedDistrict = e.target.value;
        if (selectedDistrict !== "") {
            if (Object.keys(senetorial).length > 0) {
                setStatLoading(true);

                // getting totalRegVoters
                let totalRegVoters = await senetorialNumRegisteredVoters(selectedDistrict);
                if (totalRegVoters.success === true) {
                    totalRegVoters = totalRegVoters.data;

                    totalRegVoters = parseInt(totalRegVoters);// Total number of people eligible to vote

                    // calculating totalVotesCast
                    let totalVotesCast = 0; // Total number of people that voted.
                    senetorial.contestingParties.forEach(item => {
                        item.votes.forEach(voter => {
                            if (voter["senetorialDistrict"] === selectedDistrict) {
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
                    senetorial.contestingParties.forEach(party => {
                        let partyName = party.party.abb;
                        let num = 0;
                        party.votes.forEach(vote => {
                            if (vote.senetorialDistrict === selectedDistrict) {
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
                    senetorial.contestingParties.forEach(item => {
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
                        location: selectedDistrict,
                        totalRegVoters, totalVotesCast, pVoterTurnout, nVotesByParty, pVotesByParty, pVotesByGender
                    }

                    setStats(tempStats)

                    setSenStatsSet(true);
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

    const setHorData = async e => {
        setHorStatsSet(false);
        let selectedConstituency = e.target.value;
        if (selectedConstituency !== "") {
            if (Object.keys(hor).length > 0) {
                setStatLoading(true);

                // getting totalRegVoters
                let totalRegVoters = await horNumRegisteredVoters(selectedConstituency);
                if (totalRegVoters.success === true) {
                    totalRegVoters = totalRegVoters.data;

                    totalRegVoters = parseInt(totalRegVoters);// Total number of people eligible to vote

                    // calculating totalVotesCast
                    let totalVotesCast = 0; // Total number of people that voted.
                    hor.contestingParties.forEach(item => {
                        item.votes.forEach(voter => {
                            if (voter["horConstituency"] === selectedConstituency) {
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
                    hor.contestingParties.forEach(party => {
                        let partyName = party.party.abb;
                        let num = 0;
                        party.votes.forEach(vote => {
                            if (vote.horConstituency === selectedConstituency) {
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
                    hor.contestingParties.forEach(item => {
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
                        location: selectedConstituency,
                        totalRegVoters, totalVotesCast, pVoterTurnout, nVotesByParty, pVotesByParty, pVotesByGender
                    }

                    setStats(tempStats)

                    setHorStatsSet(true);
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

    const updatePresidentialData = async election => {
        let selectedState = localStorage.getItem('selectedState');
        if (selectedState !== "") {

            if (Object.keys(election).length > 0) {
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
            alert('doesnt update')
            setStats({
                totalRegVoters: 0, totalVotesCast: 0, pVoterTurnout: 0,
                nVotesByParty: [], pVotesByParty: [], pVotesByGender: { male: 0, female: 0 }
            })
        }
    }

    const updateSenetorialData = async election => {
        let selectedDistrict = localStorage.getItem('selectedDistrict');
        if (selectedDistrict !== "") {
            if (Object.keys(election).length > 0) {
                // getting totalRegVoters
                let totalRegVoters = await senetorialNumRegisteredVoters(selectedDistrict);
                if (totalRegVoters.success === true) {
                    totalRegVoters = totalRegVoters.data;

                    totalRegVoters = parseInt(totalRegVoters);// Total number of people eligible to vote

                    // calculating totalVotesCast
                    let totalVotesCast = 0; // Total number of people that voted.
                    election.contestingParties.forEach(item => {
                        item.votes.forEach(voter => {
                            if (voter["senetorialDistrict"] === selectedDistrict) {
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
                            if (vote.senetorialDistrict === selectedDistrict) {
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
                        location: selectedDistrict,
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

    const updateHorData = async election => {
        // console.log("Function reached.");
        let selectedConstituency = localStorage.getItem('selectedConstituency');
        ;
        if (selectedConstituency !== "") {
            // console.log('constituency selected');
            if (Object.keys(election).length > 0) {
                // console.log('object not empty');
                // getting totalRegVoters
                let totalRegVoters = await horNumRegisteredVoters(selectedConstituency);
                if (totalRegVoters.success === true) {
                    totalRegVoters = totalRegVoters.data;

                    totalRegVoters = parseInt(totalRegVoters);// Total number of people eligible to vote

                    // calculating totalVotesCast
                    let totalVotesCast = 0; // Total number of people that voted.
                    election.contestingParties.forEach(item => {
                        item.votes.forEach(voter => {
                            if (voter["horConstituency"] === selectedConstituency) {
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
                            if (vote.horConstituency === selectedConstituency) {
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
                        location: selectedConstituency,
                        totalRegVoters, totalVotesCast, pVoterTurnout, nVotesByParty, pVotesByParty, pVotesByGender
                    }

                    setStats(tempStats);
                } else {
                    alert("Error fetching total registered voters.");
                }
            } else {
                console.log("Election object empty.");
            }
        } else {
            console.log("Selected constituency empty.");
            setStats({
                totalRegVoters: 0, totalVotesCast: 0, pVoterTurnout: 0,
                nVotesByParty: [], pVotesByParty: [], pVotesByGender: { male: 0, female: 0 }
            })
        }
    }

    const updateStats = election => {
        // The payload contains an updated version of the election in which a vote was cast.
        // console.log("Election updated");
        if (election.electionType === "presidential") {
            // console.log("Presidential election updated");
            updatePresidentialData(election);
        } else if (election.electionType === "senetorial") {
            // console.log("Senatorial election updated");
            updateSenetorialData(election);
        } else if (election.electionType === "hor") {
            // console.log("House of reps election updated");
            updateHorData(election);
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
                FEDERAL GOVT. ELECTIONS
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
                        Federal Election results.
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center justify-content-center">
                    <Container>
                        <Row>
                            <Tabs defaultActiveKey="gov" id="uncontrolled-tab-example" className="mb-3 text-center justify-content-center">
                                <Tab eventKey="gov" title="Presedential">
                                    <Presedential
                                        data={presidential}
                                        state={state}
                                        setPresidentialData={stateSelected}
                                    >
                                        {presStatsSet ?
                                            <Statistics election={presidential} stats={stats} />
                                            :
                                            <>
                                                {statLoading ?
                                                    <div className="p-3 m-3 alert alert-default text-center">Loading...</div>
                                                    :
                                                    <div className="p-3 m-3 alert alert-success text-center">Select a location to see result statistics.</div>
                                                }
                                            </>
                                        }
                                    </Presedential>
                                </Tab>
                                <Tab eventKey="sen" title="Senatorial">
                                    <Senetorial
                                        data={senetorial}
                                        state={state}
                                        senetorialDistricts={senetorialDistricts}
                                        setSenetorialData={districtSelected}
                                    >
                                        {senStatsSet ?
                                            <Statistics election={senetorial} stats={stats} />
                                            :
                                            <>
                                                {statLoading ?
                                                    <div className="p-3 m-3 alert alert-default text-center">Loading...</div>
                                                    :
                                                    <div className="p-3 m-3 alert alert-success text-center">Select a location to see result statistics.</div>
                                                }
                                            </>
                                        }
                                    </Senetorial>
                                </Tab>
                                <Tab eventKey="hor" title="House of Representative">
                                    <HouseOfRepresentative
                                        data={hor}
                                        state={state}
                                        federalConstituencies={federalConstituencies}
                                        setHorData={constituencySelected}
                                    >
                                        {horStatsSet ?
                                            <Statistics election={hor} stats={stats} />
                                            :
                                            <>
                                                {statLoading ?
                                                    <div className="p-3 m-3 alert alert-default text-center">Loading...</div>
                                                    :
                                                    <div className="p-3 m-3 alert alert-success text-center">Select a location to see result statistics.</div>
                                                }
                                            </>
                                        }
                                    </HouseOfRepresentative>
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

export default FederalElectionsModal
