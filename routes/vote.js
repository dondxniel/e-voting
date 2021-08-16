const express = require("express");
const router = express.Router();
const Election = require('../models/Election');
const Voters = require('../models/Voters');
const { CHECK_VOTER_ERROR } = require("../constants/errorMessages");

router.post("/vote", async (req, res)=>{
    const e = "END ";
    const c = "CON ";

    let { sessionId, serviceCode, phoneNumber, text } = req.body;
    
    let response = "";
    phoneNumber = phoneNumber.replace("+234", "0");
    if(text === ""){
        try {
            let voter = await Voters.find({phoneNumber : phoneNumber})
            voter = voter[0];
            response = `${e}Voter's name: ${voter.firstname}`;
        }catch(err){
            response = CHECK_VOTER_ERROR
        }
    }else{ 
        response = "Unknown input.";
    }
    // console.log(response);
    // console.log(text);

    res.header("Content-type", "text/plain");
    res.end(response);
})

module.exports = router;
