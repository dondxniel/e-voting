const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApprovedPartiesModel = new Schema({
    fullname: {
        type: String,
        required: true
    },
    abb: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("ApprovedParties", ApprovedPartiesModel);
