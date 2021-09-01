const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminModel = new Schema({
    name: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    state: {
        type: String, 
        required: true
    },
    adminType: {
        type: String,
        required: true
    },
    electionType: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("admins", AdminModel);
