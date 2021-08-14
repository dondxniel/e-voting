const express = require('express');
const { FETCH_STATES_ERROR, FETCH_STATES_PARSE_ERROR } = require('../constants/errorMessages');
const { FETCH_STATES_SUCCESS } = require('../constants/successMessages');
const router = express.Router();
const fs = require('fs');

router.get('/fetch-states/', (req, res) => {
    let response = {};
    fs.readFile("./constants/lists/states.json", "utf8", (err, jsonString) => {
        // console.log(`Error ${err}`)
        // console.log(`Json String ${jsonString}`)
        // console.log(`Error ${FETCH_STATES_ERROR}`)
        if (err) {
            response = {
                success: false,
                data: err,
                message: FETCH_STATES_ERROR
            }
        }else{
            try {
                const states = JSON.parse(jsonString);
                response = {
                    success: true,
                    data: states,
                    message: FETCH_STATES_SUCCESS
                }
            }catch (err) {
                response = {
                    success: false,
                    data: err,
                    message: FETCH_STATES_PARSE_ERROR
                }
            }
        }
        // console.log(response);
        res.json(response);
    });
})

module.exports = router;
