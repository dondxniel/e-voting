const express = require("express");
const router = express.Router();
const Election = require('../models/Election');
const Voters = require('../models/Voters');
const { CHECK_VOTER_ERROR, NO_VOTER, UNKNOWN_INPUT, NO_ELECTION, FETCH_ELECTION_ERROR, ERROR_FINDING_ELECTION } = require("../constants/errorMessages");
const toTitleCase = require('../functions/toTitleCase');

router.post("/vote", async (req, res) => {
    const e = "END ";
    const c = "CON ";

    let { sessionId, serviceCode, phoneNumber, text } = req.body;

    let response = "";
    phoneNumber = phoneNumber.replace("+234", "0");
    // Fetch a user with the supplied phone number.
    try {
        // fetching a voter with this particular phone number.
        let voter = await Voters.find({ phoneNumber: phoneNumber })
        // If a user exists with the phone number, proceed. Else, display an error.
        if (voter.length > 0) {
            voter = voter[0];
            try {
                // Fetching an election that concerns the fetched voter.
                let elections = await Election.find({
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
                });
                // Making sure that the user can only vote for elections that are started by his state's admin officer.
                elections = elections.filter(item => item.admin.state === voter.stateOfOrigin);
                // Preparing the text entered by the user for processing
                text = text.split("*");
                text = text.map(val => parseInt(val));
                // Checking the values entered by the user.
                if (text.length === 1 && (text.includes(null) || text.includes(NaN))) {
                    // response = `${e}Voter's name: ${voter.firstname} ${voter.lastname}`;
                    if (elections.length > 0) {
                        response = `${c}Select the election you're voting in.\n`;
                        elections.forEach((el, index) => {
                            index = index + 1;
                            response += `${index}. ${toTitleCase(el.electionType)} \n`;
                        })
                    } else {
                        response = `${e + NO_ELECTION}`
                    }
                } else if (text.length === 1 && !(text.includes(null) || text.includes(NaN))) {
                    // console.log(text)
                    text = text[0];
                    let election = elections[text - 1];
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
                } else if (text.length === 2 && !text.includes(null)) {
                    // text = text[0];
                    let election = elections[text[0] - 1];
                    // response = `${c}Select the party you would like to vote for \n`;
                    let contestingParties = [];
                    try {
                        contestingParties = election.contestingParties;
                    } catch (err) {
                        if (`${err}` !== "TypeError: Cannot read property 'contestingParties' of undefined") {
                            response = `${e + err}`;
                        }
                    }
                    let partyBeingVotedFor = text[1] - 1;
                    // console.log(contestingParties[partyBeingVotedFor])
                    // console.log(partyBeingVotedFor)
                    // console.log(text)
                    contestingParties[partyBeingVotedFor].votes.push(voter);
                    try {
                        await Election.findById(election._id, (err, resElection) => {
                            if (err) {
                                response = `${e + ERROR_FINDING_ELECTION}`
                            } else {
                                // resElection = resElection[0];
                                resElection.contestingParties = contestingParties;
                                resElection.save();
                                // console.log(contestingParties[partyBeingVotedFor]);
                                response = `${e}Congratulations, you just successfully voted ${contestingParties[partyBeingVotedFor].party.abb} for the ${toTitleCase(resElection.electionType)} elections.`
                            }
                        })
                    } catch (err) {
                        response = `${e}Error while recording your vote. Details: ${err}`;
                    }
                } else {
                    response = `${e + UNKNOWN_INPUT}`;
                }
            } catch (err) {
                response = `${e + FETCH_ELECTION_ERROR}. Details: ${err}`
            }
        } else {
            response = `${e + NO_VOTER}`;
        }
    } catch (err) {
        response = `${e + CHECK_VOTER_ERROR}. Details: ${err}`
    }

    res.header("Content-type", "text/plain");
    res.end(response);
})
// 
router.post('/test-vote', async (req, res) => {
    // let txt = "";
    // txt = txt.split("*");
    // txt = txt.map(item => parseInt(item))
    // res.json({ txtLength: txt.length, txt });
    let phoneNumber = "09023830868";
    try {
        let voter = await Voters.find({ phoneNumber: phoneNumber })
        voter = voter[0];
        try {
            let elections = await Election.find({
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
            });

            elections = elections.filter(item => item.admin.state === voter.stateOfOrigin);

            res.json(elections)
        } catch (err) {
            res.json({ err });
        }
    } catch (err) {
        res.json({ err })
    }
})

module.exports = router;
