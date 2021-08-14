const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth")
const Election = require('../models/Election');
const { START_ELECTION_SUCCESS } = require("../constants/successMessages");
const { START_ELECTION_ERROR } = require("../constants/errorMessages");

router.post('/start-election', auth, (req, res) => {
    const election = req.body;
    const newElection = new Election(election);
    newElection.save()
    .then(data => {
        res.json({
            success: true,
            data,
            message: START_ELECTION_SUCCESS
        })
    })
    .catch(err => {
        res.json({
            success: false,
            data: err,
            message: START_ELECTION_ERROR
        })
    })
})

module.exports = router;
