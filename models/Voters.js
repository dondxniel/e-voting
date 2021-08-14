const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VotersModel = new Schema({
    firstname: {
        type:  String,
        required: true
    },
    lastname: {
        type:  String,
        required: true
    },
    dob: {
        type:  String,
        required: true
    },
    nin: {
        type:  String,
        required: true
    },
    nationality: {
        type:  String,
        required: true
    },
    stateOfOrigin: {
        type:  String,
        required: true
    },
    lga: {
        type:  String,
        required: true
    },
    ward: {
        type:  String,
        required: true
    },
    senetorialDistrict: {
        type:  String,
        required: true
    },
    hoaConstituency: {
        type:  String,
        required: true
    },
    horConstituency: {
        type:  String,
        required: true
    },
})

module.exports = mongoose.model("Voters", VotersModel);


/* 
{
    firstname: 'Daniel',
    lastname: 'Don',
    dob: '2021-08-24',
    nin: '0987653454657',
    nationality: 'morocco',
    stateOfOrigin: 'imo',
    lga: 'kaduna',
    ward: 'abia',
    senetorialDistrict: 'abia',
    hoaConstituency: 'imo',
    horConstituency: 'abia',
}
*/

