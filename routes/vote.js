const express = require("express");
const router = express.Router();
const Election = require('../models/Election');
const Voters = require('../models/Voters');
const { CHECK_VOTER_ERROR, NO_VOTER, UNKNOWN_INPUT, NO_ELECTION, FETCH_ELECTION_ERROR } = require("../constants/errorMessages");
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
                // Checking the values entered by the user.
                if (text === "") {
                    // response = `${e}Voter's name: ${voter.firstname} ${voter.lastname}`;
                    if (elections.length > 0) {
                        response = `${c}Select the election you\'re voting in.\n`;
                        election.forEach((el, index) => {
                            index = index + 1;
                            response += `${index}. ${el.electionType}`;
                        })
                    } else {
                        response = `${e + NO_ELECTION}`
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

router.post('/test-vote', async (req, res) => {
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
