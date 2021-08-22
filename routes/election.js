const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth")
const Election = require('../models/Election');
const { START_ELECTION_SUCCESS } = require("../constants/successMessages");
const { START_ELECTION_ERROR, INAPPROPRIATE_ELECTION_TIMING } = require("../constants/errorMessages");

router.post('/start-election', auth, (req, res) => {
    const election = req.body;
    // { state: 'Kaduna', adminType: 'sub', electionType: 'local' }
    // Making sure an admin can not create another election until the first one is over.
    Election.find({}, (err, result) => {
        if (err) {
            res.json({
                success: false,
                data: err,
                message: START_ELECTION_ERROR
            })
        } else {
            result = result.filter(item => (item.admin.state === election.admin.state && item.electionType === election.electionType))
            let allowCreateElection = true;
            result.forEach(item => {
                let electionDate = item.electionDate.split("-");
                electionDate = new Date(Date.UTC(electionDate[0], electionDate[1], electionDate[2]));
                electionDate = electionDate.getTime();
                let submittedElectionDate = election.electionDate.split("-");
                submittedElectionDate = new Date(Date.UTC(submittedElectionDate[0], submittedElectionDate[1], submittedElectionDate[2]));
                submittedElectionDate = submittedElectionDate.getTime();
                if (electionDate >= submittedElectionDate) {
                    allowCreateElection = false;
                }
            })
            if (allowCreateElection) {
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
            } else {
                res.json({
                    success: false,
                    data: election,
                    message: INAPPROPRIATE_ELECTION_TIMING
                })
            }
        }
    })

})

module.exports = router;
