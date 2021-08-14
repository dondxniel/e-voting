const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth")
const Admins = require("../models/Admins");
const { SAVE_ADMIN_ERROR, FETCH_ADMINS_ERROR } = require('../constants/errorMessages');
const { SAVE_ADMIN_SUCCESS, FETCH_ADMINS_SUCCESS } = require('../constants/successMessages');

router.post('/create-admin', auth, (req, res) => {
    const { name, email, password, selectedState, adminType, electionType } = req.body;

    const newAdmin = new Admins({ name, email, password, state: selectedState, adminType, electionType });
    
    newAdmin.save()
    .then(data => {
        res.json({
            success: true,
            data,
            message: SAVE_ADMIN_SUCCESS
        })
    })
    .catch(err => {
        res.json({
            success: false,
            data: err,
            message: SAVE_ADMIN_ERROR
        })
    })
})

router.get('/fetch-admins', auth, (req, res) => {
    Admins.find({})
    .sort({_id: -1})
    .then(data => {
        res.json({
            success: true,
            data: data,
            message: FETCH_ADMINS_SUCCESS
        })
    })
    .catch(err => {
        res.json({
            success: false,
            data: err,
            message: FETCH_ADMINS_ERROR
        })
    })
})

module.exports = router;