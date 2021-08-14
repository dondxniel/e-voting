const Admin = require("../models/Admins");
const { CHECK_ADMIN_EXISTENCE_ERROR } = require("../constants/errorMessages")

const check = (req, res, next) => {

    const {email} = req.body;
    Admin.find({email})
    .then(res => {
        if(res.length === 0){
            req.adminExists = false;
        }else{
            req.adminExists =  true;
            req.adminThatExists = res[0];
        }
        next()
    })
    .catch(err => {
        res.json({
            success: false,
            data: err,
            message: CHECK_ADMIN_EXISTENCE_ERROR
        })
    })
}

module.exports = check;
