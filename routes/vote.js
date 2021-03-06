const express = require("express");
const router = express.Router();
const Election = require('../models/Election');
const Voters = require('../models/Voters');
const { CHECK_VOTER_ERROR, NO_VOTER, UNKNOWN_INPUT, NO_ELECTION, FETCH_ELECTION_ERROR, ERROR_FINDING_ELECTION, UNKNOWN_NUMBER_FORMAT_ERROR } = require("../constants/errorMessages");
const recognizedNumberFormats = require("../constants/recognizedNumberFormats");
const toTitleCase = require('../functions/toTitleCase');

router.post("/vote", async (req, res) => {
    const e = "END ";
    const c = "CON ";

    let { sessionId, serviceCode, phoneNumber, text } = req.body;

    let response = "";
    try {
        phoneNumber = (typeof phoneNumber !== "undefined") && phoneNumber.replace("+234", "0");

        let splittedPhoneNumber = phoneNumber.split("");
        let first3 = splittedPhoneNumber[0] + splittedPhoneNumber[1] + splittedPhoneNumber[2];
        if (recognizedNumberFormats.includes(first3)) {
            // Fetch a user with the supplied phone number.
            try {
                // fetching a voter with this particular phone number.
                let voter = await Voters.find({ phoneNumber: phoneNumber })
                // If a user exists with the phone number, proceed. Else, display an error.
                if (voter.length > 0) {
                    voter = voter[0];
                    try {
                        // Fetching an election that concerns the fetched voter.

                        // Getting today's date to make sure that a user doesn't see an election that's not happening today on the list
                        var dateViewList = new Date();
                        var yearViewList = dateViewList.getFullYear();
                        var monthViewList = (dateViewList.getMonth() + 1 < 10) ? `0${dateViewList.getMonth() + 1}` : `${dateViewList.getMonth() + 1}`;
                        var dayViewList = (dateViewList.getDate() < 10) ? `0${dateViewList.getDate()}` : `${dateViewList.getDate()}`;
                        var todayViewList = `${yearViewList}-${monthViewList}-${dayViewList}`;
                        let elections = await Election.find({
                            $and: [
                                {
                                    electionDate: todayViewList
                                },
                                {
                                    $or: [
                                        { $and: [{ electionType: 'presidential' }, { location: voter.stateOfOrigin }] },
                                        { $and: [{ electionType: 'senetorial' }, { location: voter.senetorialDistrict }] },
                                        { $and: [{ electionType: 'hor' }, { location: voter.horConstituency }] },
                                        { $and: [{ electionType: 'governorship' }, { location: voter.stateOfOrigin }] },
                                        { $and: [{ electionType: 'hoa' }, { location: voter.hoaConstituency }] },
                                        { $and: [{ electionType: 'chairmanship' }, { location: voter.lga }] },
                                        { $and: [{ electionType: 'counsellorship' }, { location: voter.ward }] },
                                        { location: 'all' }
                                    ]
                                }
                            ]
                        });
                        // Making sure that the user can only vote for elections that are started by his state's admin officer.
                        elections = elections.filter(item => item.admin.state === voter.stateOfOrigin);
                        // Preparing the text entered by the user for processing
                        text = text.split("*");
                        text = text.map(val => parseInt(val));
                        // Checking the values entered by the user.
                        if (text.length === 1 && (text.includes(null) || text.includes(NaN))) {
                            if (elections.length > 0) {
                                response = `${c}Select the election you're voting in.\n`;
                                elections.forEach((el, index) => {
                                    index = index + 1;
                                    response += `${index}. ${toTitleCase(el.electionType)} \n`;
                                })
                            } else {
                                const date = new Date();
                                const year = date.getFullYear();
                                const month = (date.getMonth() + 1 < 10) ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
                                const day = (date.getDate() < 10) ? `0${date.getDate()}` : `${date.getDate()}`;
                                const today = `${year}-${month}-${day}`;
                                response = `${e + NO_ELECTION + today}`;
                            }
                        } else if (text.length === 1 && !(text.includes(null) || text.includes(NaN))) {
                            // console.log(text)
                            text = text[0];
                            let election = {};
                            // Making sure the user doesn't put in rogue values to cause an undefined index error
                            try {
                                election = elections[text - 1];
                                // Trying to make sure the voter doesn't try to vote on other days asides the election's date.
                                var date = new Date();
                                var year = date.getFullYear();
                                var month = (date.getMonth() + 1 < 10) ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
                                var day = (date.getDate() < 10) ? `0${date.getDate()}` : `${date.getDate()}`;
                                var today = `${year}-${month}-${day}`;
                                if (today === election.electionDate) {
                                    response = `${c}Select the party you would like to vote for \n`;
                                    let contestingParties = [];
                                    try {
                                        contestingParties = election.contestingParties;
                                    } catch (err) {
                                        if (`${err}` !== "TypeError: Cannot read property 'contestingParties' of undefined") {
                                            response = `${e + err}`;
                                        }
                                    }
                                    contestingParties.forEach((item, index) => {
                                        index = index + 1;
                                        response += `${index}. ${item.party.abb} (${item.party.fullname}) \n`;
                                    })
                                } else {
                                    response = `${e}Today's date is ${today}, but the election's date is ${election.electionDate}. You can only vote on the election date.`;
                                }
                            } catch (err) {
                                response = `${e + UNKNOWN_INPUT}`
                            }
                        } else if (text.length === 2 && !text.includes(null)) {
                            // text = text[0];
                            let election = {};
                            // Making sure the user doesn't put in rogue values to cause an undefined index error
                            try {
                                election = elections[text[0] - 1];

                                const date = new Date();
                                const year = date.getFullYear();
                                const month = (date.getMonth() + 1 < 10) ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
                                const day = (date.getDate() < 10) ? `0${date.getDate()}` : `${date.getDate()}`;
                                const today = `${year}-${month}-${day}`;
                                if (today === election.electionDate) {
                                    let contestingParties = [];
                                    try {
                                        contestingParties = election.contestingParties;
                                    } catch (err) {
                                        if (`${err}` !== "TypeError: Cannot read property 'contestingParties' of undefined") {
                                            response = `${e + err}`;
                                        }
                                    }
                                    let partyBeingVotedFor = text[1] - 1;
                                    let votes = contestingParties[partyBeingVotedFor].votes;
                                    // Get a list of all the IDs to make sure that a single voter cannot vote twice.
                                    let ids = votes.map(item => item._id);
                                    // Check if the voter's ID is among the list of voters ids.
                                    if (!ids.includes(voter._id)) {
                                        votes.push(voter);//Add the voter's vote.
                                        try {
                                            await Election.findById(election._id, (err, resElection) => {
                                                if (err) {
                                                    response = `${e + ERROR_FINDING_ELECTION}`
                                                } else {
                                                    // resElection = resElection[0];
                                                    resElection.contestingParties = contestingParties;
                                                    // console.log(resElection);
                                                    resElection.save();
                                                    response = `${e}Congratulations, you just successfully voted ${contestingParties[partyBeingVotedFor].party.abb} for the ${toTitleCase(resElection.electionType)} elections.`
                                                    // Socket emit that a vote has been cast.
                                                    req.io.emit('vote_cast', resElection);
                                                }
                                            })
                                        } catch (err) {
                                            response = `${e}Error while recording your vote. Details: ${err}`;
                                        }
                                    } else {
                                        response = `${e}Sorry, but you can not vote twice.`;
                                    }
                                } else {
                                    response = `${e}Today's date is ${today}, but the election's date is ${election.electionDate}. You can only vote on the election date.`;
                                }
                            } catch (err) {
                                response = `${e + UNKNOWN_INPUT}`;

                            }
                        } else {
                            response = `${e + UNKNOWN_INPUT}`;
                        }
                    } catch (err) {
                        response = `${e + FETCH_ELECTION_ERROR}`
                    }
                } else {
                    response = `${e + NO_VOTER}`;
                }
            } catch (err) {
                response = `${e + CHECK_VOTER_ERROR}`;
            }
        } else {
            response = `${e + UNKNOWN_NUMBER_FORMAT_ERROR}`
        }
    } catch (err) {
        response = `${e + err}`;
    }
    res.header("Content-type", "text/plain");
    res.end(response);
})

module.exports = router;
