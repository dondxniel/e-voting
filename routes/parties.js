const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth")
const ApprovedParties = require('../models/ApprovedParties');
const { ADD_PARTY_SUCCESS, FETCH_PARTIES_SUCCESS } = require("../constants/successMessages");
const { ADD_PARTY_ERROR, FETCH_PARTIES_ERROR } = require("../constants/errorMessages");

router.post('/add-party', auth, (req, res) => {
    const { fullname, abb } = req.body;

    const newParty = new ApprovedParties({ fullname, abb });

    newParty.save({})    
    .then(response => {
        res.json({
            success: true,
            data: response,
            message: ADD_PARTY_SUCCESS
        })
    })
    .catch(err => {
        res.json({
            success: false,
            data: err,
            message: ADD_PARTY_ERROR
        })
    })
})

router.get('/fetch-parties', auth, (req, res) => {
    ApprovedParties.find({})
    .sort({_id: -1})
    .then(data => {
        res.json({
            success: true,
            data: data,
            message: FETCH_PARTIES_SUCCESS
        })
    })
    .catch(err => {
        res.json({
            success: false,
            data: err,
            message: FETCH_PARTIES_ERROR
        })
    })
})


module.exports = router;
