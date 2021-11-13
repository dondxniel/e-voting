import { useState, useEffect } from 'react';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { FaPrint } from 'react-icons/fa';
// Federal
import Presidential from './modals/FederalElections/presentational/Presedential';
import Senatorial from './modals/FederalElections/presentational/Senetorial';
import HouseOfRepresentative from './modals/FederalElections/presentational/HouseOfRepresentative';
// State
import Governorship from './modals/StateElections/presentational/Governorship';
import HouseOfAssembly from './modals/StateElections/presentational/HouseOfAssembly';
// Local
import Chairmanship from './modals/LgElections/presentational/Chairmanship';
import Counsellorship from './modals/LgElections/presentational/Counsellorship';
// Stats
import Statistics from './modals/presentational/Statistics';

const HistoryListItem = ({
    election,
    electionType,
    date,
    state,
    stateNumRegisteredVoters,
    horNumRegisteredVoters,
    lgaNumRegisteredVoters,
    wardNumRegisteredVoters,
    hoaConstituencyNumRegisteredVoters,
    senetorialNumRegisteredVoters,

    federalConstituencies,
    stateConstituencies,
    lgas,
    wards,
    senetorialDistricts,

    setWards
}) => {

    const [selectedLg, setSelectedLg] = useState("");

    const [show, setShow] = useState(false);
    const [statLoading, setStatLoading] = useState(false);
    const [statsSet, setStatsSet] = useState(false);
    const [stats, setStats] = useState({
        totalRegVoters: 0, totalVotesCast: 0, pVoterTurnout: 0,
        nVotesByParty: [], pVotesByParty: [], pVotesByGender: { male: 0, female: 0 }
    })

    const lgSelected = e => {
        setSelectedLg(e.target.value);
        setWards(e.target.value);
    }

    const setPresidentialData = async e => {
        setStatsSet(false);
        let selectedState = e.target.value;
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

                    setStats(tempStats)

                    setStatsSet(true);
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
        setStatsSet(false);
        let selectedConstituency = e.target.value;
        if (selectedConstituency !== "") {
            if (Object.keys(election).length > 0) {
                setStatLoading(true);

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

                    setStats(tempStats)

                    setStatsSet(true);
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
        setStatsSet(false);
        let selectedDistrict = e.target.value;
        if (selectedDistrict !== "") {
            if (Object.keys(election).length > 0) {
                setStatLoading(true);

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

                    setStats(tempStats)

                    setStatsSet(true);
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

    const setGovernorshipData = async e => {
        if (Object.keys(election).length !== 0) {
            setStatsSet(false);

            let selectedState = e.target.value;
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

                        setStats(tempStats)

                        setStatsSet(true);
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
        if (Object.keys(election).length !== 0) {
            setStatsSet(false);
            let selectedStateConstituency = e.target.value;

            if (selectedStateConstituency !== "") {
                if (Object.keys(election).length > 0) {
                    setStatLoading(true);

                    // getting totalRegVoters
                    let totalRegVoters = await hoaConstituencyNumRegisteredVoters(selectedStateConstituency);

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

                        setStatsSet(true);
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

    const setChairmanshipData = async e => {
        if (Object.keys(election).length !== 0) {
            setStatsSet(false);
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

                setStats(tempStats)

                setStatsSet(true);
                setStatLoading(false);

            } else {
                alert("Error fetching total registered voters.");
            }
        }

    }

    const setCounselorshipData = async e => {
        if (Object.keys(election).length !== 0) {
            setStatLoading(true);
            setStatsSet(false);
            // getting totalRegVoters
            let totalRegVoters = await wardNumRegisteredVoters(selectedLg, e.target.value);

            if (totalRegVoters.success === true) {
                totalRegVoters = totalRegVoters.data;

                totalRegVoters = parseInt(totalRegVoters);// Total number of people eligible to vote


                // calculating totalVotesCast
                let totalVotesCast = 0; // Total number of people that voted.

                election.contestingParties.forEach(item => {
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
                election.contestingParties.forEach(party => {
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
                    location: e.target.value,
                    totalRegVoters, totalVotesCast, pVoterTurnout, nVotesByParty, pVotesByParty, pVotesByGender
                }

                setStats(tempStats)

                setStatsSet(true);
                setStatLoading(false);
            } else {
                alert("Error fetching total registered voters.");
            }
        }

    }

    const returnModalDisplay = eType => {
        if (eType === "presidential") {
            return (
                <Presidential
                    data={election}
                    state={state}
                    setPresidentialData={setPresidentialData}
                >
                    {statsSet ?
                        <Statistics election={election} stats={stats} />
                        :
                        <>
                            {statLoading ?
                                <div className="p-3 m-3 alert alert-default text-center">Loading...</div>
                                :
                                <div className="p-3 m-3 alert alert-success text-center">Select a location to see result statistics.</div>
                            }
                        </>
                    }
                </Presidential>
            )
        } else if (eType === "senetorial") {
            return (
                <Senatorial
                    data={election}
                    state={state}
                    senetorialDistricts={senetorialDistricts}
                    setSenetorialData={setSenetorialData}
                >
                    {statsSet ?
                        <Statistics election={election} stats={stats} />
                        :
                        <>
                            {statLoading ?
                                <div className="p-3 m-3 alert alert-default text-center">Loading...</div>
                                :
                                <div className="p-3 m-3 alert alert-success text-center">Select a location to see result statistics.</div>
                            }
                        </>
                    }
                </Senatorial>
            )
        } else if (eType === "hor") {
            return (
                <HouseOfRepresentative
                    data={election}
                    state={state}
                    federalConstituencies={federalConstituencies}
                    setHorData={setHorData}
                >
                    {statsSet ?
                        <Statistics election={election} stats={stats} />
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
            )
        } else if (eType === "governorship") {
            return (
                <Governorship
                    data={election}
                    state={state}
                    setGovernorshipData={setGovernorshipData}
                >
                    {statsSet ?
                        <Statistics election={election} stats={stats} />
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
            )
        } else if (eType === "hoa") {
            return (
                <HouseOfAssembly
                    data={election}
                    state={state}
                    stateConstituencies={stateConstituencies}
                    setHoaData={setHoaData}
                // selectedHoaConstituency={selectedHoaConstituency}
                >
                    {statsSet ?
                        <Statistics election={election} stats={stats} />
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
            )
        } else if (eType === "chairmanship") {
            return (
                <Chairmanship
                    data={election}
                    lgas={lgas}
                    setChairmanshipData={setChairmanshipData}
                    selectedLg={selectedLg}
                >
                    {statsSet ?
                        <Statistics election={election} stats={stats} />
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
            )
        } else if (eType === "counselorship") {
            return (
                <Counsellorship
                    data={election}
                    lgas={lgas}
                    wards={wards}//
                    lgSelected={lgSelected}//
                    selectedLg={selectedLg}//
                    setSelectedWardFunc={setCounselorshipData}//
                // selectedWard={selectedWard}
                >
                    {statsSet ?
                        <Statistics election={election} stats={stats} />
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
            )
        }
    }

    const ongoingOrPast = (passedDate) => {
        let date = new Date();
        let year = date.getFullYear();
        let month = (date.getMonth() + 1 < 10) ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
        let day = (date.getDate() < 10) ? `0${date.getDate()}` : `${date.getDate()}`;
        let today = `${year}-${month}-${day}`;

        console.log(`Election Date: ${passedDate}`)

        today = new Date(today);
        passedDate = passedDate.split("-");
        passedDate = `${passedDate[2]}-${passedDate[1]}-${passedDate[0]}`;
        passedDate = new Date(passedDate);

        console.log(`Election Date: ${passedDate}`)

        today = today.getTime();
        passedDate = passedDate.getTime();

        console.log(`Today: ${today}`)
        console.log(`Election Date: ${passedDate}`)

        let returnValue = "";
        if (passedDate > today) {
            returnValue = "Upcoming";
        } else if (passedDate < today) {
            returnValue = "Passed";
        } else {
            returnValue = "Ongoing";
        }

        return returnValue;
    }

    return (
        <>
            <div className="alert alert-primary history-list-item" onClick={() => setShow(true)}>
                <Container>
                    <Row>
                        <Col className="text-start">
                            {electionType + ", " + date + "."}
                        </Col>
                        <Col className="text-end">
                            {(ongoingOrPast(date) === "Passed") ?
                                <span className="text-success">{ongoingOrPast(date)}</span>
                                :
                                <span className="text-danger">{ongoingOrPast(date)}</span>
                            }
                        </Col>
                    </Row>
                </Container>
            </div>
            <Modal
                show={show}
                onHide={() => setShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-center"
                centered
            >

                <Modal.Body className="text-center justify-content-center">
                    <Container>
                        <Row>
                            {returnModalDisplay(election.electionType)}
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

export default HistoryListItem;