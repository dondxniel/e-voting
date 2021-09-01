const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ElectionModel = new Schema({
    admin: {
        type: {
            state: String, 
            adminType: String, 
            electionType: String
        },
        required: true
    },
    electionType : {
        type: String,
        required: true
    },
    location: {
        type: [String],
        required: true
    },
    contestingParties: {
        type: [{
            candidate: String,
            party: {
                _id: String, 
                fullname: String, 
                abb: String
            },
            votes: [{
                firstname: String,//first name
                lastname: String,//last name
                dob: String, //date of birth
                nin: String, //NIN
                nationality: String, 
                stateOfOrigin: String,
                lga: String, //Local government area
                ward: String, 
                senetorialDistrict: String,
                hoaConstituency: String, //house of assembly constituency
                horConstituency: String, //house of representatives constituency
            }]
        }],
        required: true
    },
    electionDate: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Election", ElectionModel);
