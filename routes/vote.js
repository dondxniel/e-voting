const express = require("express");
const router = express.Router();
const Election = require('../models/Election');
const Voters = require('../models/Voters');
const { CHECK_VOTER_ERROR, NO_VOTER, UNKNOWN_INPUT } = require("../constants/errorMessages");

router.post("/vote", async (req, res)=>{
    const e = "END ";
    const c = "CON ";

    let { sessionId, serviceCode, phoneNumber, text } = req.body;
    
    let response = "";
    phoneNumber = phoneNumber.replace("+234", "0");
    if(text === ""){
        try {
            let voter = await Voters.find({phoneNumber : phoneNumber})
            if(voter.length > 0){
                voter = voter[0];
                response = `${e}Voter's name: ${voter.firstname} ${voter.lastname}`;
            }else{
                response = NO_VOTER;
            }
        }catch(err){
            response = CHECK_VOTER_ERROR
        }
    }else{
        response = UNKNOWN_INPUT;
    }
    
    res.header("Content-type", "text/plain");
    res.end(response);
})

module.exports = router;
