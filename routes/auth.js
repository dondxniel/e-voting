const express = require("express");
const router = express.Router();
const checkAdminExistence = require("../middleware/checkAdminExistence")
const { ADMIN_NONEXISTENT, INCORRECT_PASSWORD, TOKEN_ERROR } = require("../constants/errorMessages");
const { LOGIN_SUCCESS } = require("../constants/successMessages");
const jwt = require("jsonwebtoken");

router.post('/login', checkAdminExistence, (req, res) => {
    if(req.adminExists){
        const { email, password } = req.adminThatExists;
        const enteredPassword = req.body.password;
        if(password === enteredPassword){
            try{
                const token = jwt.sign({email, password}, process.env.TOKEN_SECRET, {expiresIn: 86400});
                // Expires in one day.
                res.json({
                    success: true,
                    data: {token, admin: req.adminThatExists},
                    message: LOGIN_SUCCESS
                })
            }catch(e){
                res.json({
                    success: false,
                    data: e,
                    message: `${TOKEN_ERROR}: ${e}`
                })
            }
        }else{
            res.json({
                success: false,
                message: INCORRECT_PASSWORD
            })
        }
    }else{
        res.json({
            success: false,
            message: ADMIN_NONEXISTENT
        })
    }
})

module.exports = router;
