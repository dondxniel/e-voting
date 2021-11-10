const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth")
const Election = require('../models/Election');
const Voters = require('../models/Voters');
const { FETCH_HISTORY_SUCCESS } = require("../constants/successMessages");
const { FETCH_HISTORY_ERROR } = require("../constants/errorMessages");

router.get('/fetch-history', (req, res) => {
    Election.find({})
        .sort({ _id: -1 })
        .then(data => {
            // console.log(data);
            res.json({
                success: true,
                data: data,
                message: FETCH_HISTORY_SUCCESS
            })
        })
        .catch(err => {
            res.json({
                success: false,
                data: err,
                message: FETCH_HISTORY_ERROR
            })
        })
})

module.exports = router;
