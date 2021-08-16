const express = require("express");
const router = express.Router();
const Election = require('../models/Election');
const Voters = require('../models/Voters');
const { CHECK_VOTER_ERROR } = require("../constants/errorMessages");

router.post("/vote", async (req, res)=>{
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    const e = "END ";
    const c = "CON ";
    let response = "";
    if(text === ""){
        phoneNumber = phoneNumber.replace(/+234/, "0");
        // Check if the a user exists with the phone number.
        Voters.find({phoneNumber})
        .then(voter => {
            voter = voter[0];
            response = `${e}Voter's name: ${voter.firstname}`;
        })
        .catch(err => {
            response = CHECK_VOTER_ERROR
        })
    }

    res.header("Content-type", "text/plain");
    res.end(response);
    
})

module.exports = router;
