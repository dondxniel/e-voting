const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth")
const Election = require('../models/Election');
const Voters = require('../models/Voters');
const { START_ELECTION_SUCCESS, FETCH_ELECTIONS_SUCCESS } = require("../constants/successMessages");
const { START_ELECTION_ERROR, INAPPROPRIATE_ELECTION_TIMING, FETCH_ELECTION_ERROR } = require("../constants/errorMessages");

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

router.get('/fetch-election-stats', (req, res) => {
    Election.find({})
        .then(data => {
            // console.log(data);
            // The following lines ensure that elections that aren't happening on the current date or have not happened yet don't get fetched.
            const date = new Date();
            const year = `${date.getFullYear()}`;
            const month = (date.getMonth() + 1 < 10) ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
            const day = (date.getDate() < 10) ? `0${date.getDate()}` : `${date.getDate()}`;
            const today = new Date(Date.UTC(year, month, day));

            data = data.filter(item => {
                let electionDate = item.electionDate.split('-');
                electionDate = new Date(Date.UTC(electionDate[0], electionDate[1], electionDate[2]));
                return electionDate >= today;
            })

            // Gathering all the results for the local govt. elections.
            let localsCounsellorship = data.filter(item => item.admin.electionType === 'local' && item.electionType === 'counselorship');
            localsCounsellorship = localsCounsellorship.length > 0 ? [localsCounsellorship[0]] : [];
            let localsChairmanship = data.filter(item => item.admin.electionType === 'local' && item.electionType === 'chairmanship');
            localsChairmanship = localsChairmanship.length > 0 ? [localsChairmanship[0]] : [];
            // console.log(localsChairmanship);

            // Gathering all the results for the state govt. elections.
            let stateGovernorship = data.filter(item => item.admin.electionType === 'state' && item.electionType === 'governorship');
            stateGovernorship = stateGovernorship.length > 0 ? [stateGovernorship[0]] : [];
            let stateHoa = data.filter(item => item.admin.electionType === 'state' && item.electionType === 'hoa');
            stateHoa = stateHoa.length > 0 ? [stateHoa[0]] : [];

            // Gathering all the results for the federal govt. elections.
            let federalPresedential = data.filter(item => item.admin.electionType === 'federal' && item.electionType === 'presedential');
            federalPresedential = federalPresedential.length > 0 ? [federalPresedential[0]] : [];
            let federalSenaotorial = data.filter(item => item.admin.electionType === 'federal' && item.electionType === 'senatorial');
            federalSenaotorial = federalSenaotorial.length > 0 ? [federalSenaotorial[0]] : [];
            let federalHor = data.filter(item => item.admin.electionType === 'federal' && item.electionType === 'hor');
            federalHor = federalHor.length > 0 ? [federalHor[0]] : [];

            // The result that gets returned to the client.
            let l = [...localsCounsellorship, ...localsChairmanship];
            console.log(l)
            res.json({
                success: true,
                data: {
                    locals: [...localsCounsellorship, ...localsChairmanship],
                    states: [...stateGovernorship, ...stateHoa],
                    federals: [...federalPresedential, ...federalSenaotorial, ...federalHor]
                },
                message: FETCH_ELECTIONS_SUCCESS
            })
        })
        .catch(err => {
            res.json({
                success: false,
                data: err,
                message: FETCH_ELECTION_ERROR
            })
        })
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