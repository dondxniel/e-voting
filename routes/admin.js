const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth")
const Admins = require("../models/Admins");
const checkAdminExitence = require("../middleware/checkAdminExistence");
const { SAVE_ADMIN_ERROR, FETCH_ADMINS_ERROR, ADMIN_EXISTS, JU_ALREADY_EXISTS } = require('../constants/errorMessages');
const { SAVE_ADMIN_SUCCESS, FETCH_ADMINS_SUCCESS } = require('../constants/successMessages');

router.post('/create-admin', checkAdminExistence, auth, (req, res) => {
    if (!req.adminExists) {
        const { name, email, password, selectedState, adminType, electionType } = req.body;

        const newAdmin = new Admins({ name, email, password, state: selectedState, adminType, electionType });

        Admins.find({ state: selectedState, electionType }, (err, result) => {
            if (err) {
                res.json({
                    success: false,
                    data: err,
                    message: SAVE_ADMIN_ERROR
                })
            } else {
                if (result.length > 0) {
                    res.json({
                        success: false,
                        data: err,
                        message: SAVE_ADMIN_ERROR
                    })
                } else {
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
                }
            }
        })
    } else {
        res.json({
            success: false,
            data: err,
            message: ADMIN_EXISTS
        })
    }
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