const express = require("express");
const router = express.Router();

router.post("/vote", (req, res)=>{
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    let response = `END This is to verify that ${phoneNumber} actually entered a USSD code to access this service.`;

    res.header("Content-type", "text/plain");
    res.end(response);
    
})

module.exports = router;
