const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth")
const Voters = require('../models/Voters');
const { } = require("../constants/successMessages");
const { } = require("../constants/errorMessages");


router.get('/lga-num-of-registered-voters/:state/:locationType/:location', auth, (req, res) => {
    const { state, locationType, location } = req.params;
    const queryObj = {};
    queryObj["stateOfOrigin"] = state;
    queryObj[locationType] = location;

    if (state !== "" && locationType !== "" && location !== "") {
        Voters.countDocuments({ ...queryObj })
            .then(data => {
                res.json({
                    success: true,
                    data: data
                })
            })
            .catch(err => {
                res.json({
                    success: false,
                    data: err
                })
            })
    } else {
        res.json({
            success: false,
            message: "Invalid parameters."
        })
    }
})
router.get('/ward-num-of-registered-voters/:state/:lga', auth, (req, res) => {
    const { state, location } = req.params;
    const queryObj = {};
    queryObj["stateOfOrigin"] = state;
    queryObj["lga"] = lga;

    if (state !== "" && lga !== "") {
        Voters.countDocuments({ ...queryObj })
            .then(data => {
                res.json({
                    success: true,
                    data: data
                })
            })
            .catch(err => {
                res.json({
                    success: false,
                    data: err
                })
            })
    } else {
        res.json({
            success: false,
            message: "Invalid parameters."
        })
    }
})
module.exports = router;
/*
{
    "_id": "611977ebb521b8001675cf9a",
    "firstname": "Daniel",
    "lastname": "Don",
    "dob": "2021-08-17",
    "nin": "345678909675",
    "nationality": "Nigeria",
    "stateOfOrigin": "Kaduna",
    "lga": "Kauru",
    "ward": "Pari",
    "senetorialDistrict": "Kaduna North",
    "hoaConstituency": "Igabi West",
    "horConstituency": "Kauru",
    "__v": 0,
    "phoneNumber": "09023830868"
}{
    "_id": "61225f3ad0db540016f1cabd",
    "firstname": "Daniel",
    "lastname": "Don",
    "phoneNumber": "09023830868",
    "dob": "2000-03-18",
    "nin": "46756171622552",
    "nationality": "Nigeria",
    "stateOfOrigin": "Kaduna",
    "lga": "Chikun",
    "ward": "Chikun",
    "senetorialDistrict": "Kaduna Central",
    "hoaConstituency": "Chikun",
    "horConstituency": "Chikun/Kajuru",
    "__v": 0
}
*/