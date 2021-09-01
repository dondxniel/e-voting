const express = require("express");
const Voters = require("../models/Voters.js");
const router = express.Router();
const { REGISTER_VOTER_ERROR } = require("../constants/errorMessages");
const { REGISTER_VOTER_SUCCESS } = require("../constants/successMessages");

router.post("/register-voter", (req, res) => {
    const { formData } = req.body;
    
    const newVoter = new Voters({...formData});

    newVoter.save()
    .then(data => {
        res.json({
            success: true,
            data: data,
            message: REGISTER_VOTER_SUCCESS
        })
    })
    .catch(err => {
        res.json({
            success: false,
            data: err,
            message: REGISTER_VOTER_ERROR
        })
    })
    
})

module.exports = router;

/* 
{
    firstname: 'Daniel',
    lastname: 'Don',
    dob: '2021-08-24',
    nin: '0987653454657',
    nationality: 'morocco',
    stateOfOrigin: 'imo',
    lga: 'kaduna',
    ward: 'abia',
    senetorialDistrict: 'abia',
    hoaConstituency: 'imo',
    horConstituency: 'abia'
}
*/