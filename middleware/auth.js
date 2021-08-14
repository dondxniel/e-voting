const jwt = require("jsonwebtoken");
const { INVALID_TOKEN, NO_TOKEN, INVALID_TOKEN_FORMAT } = require("../constants/errorMessages");

const auth = (req, res, next) => {
    if(req.header("Authorization")){
        let token = req.header("Authorization");
        token = token.split(' ')[1];
        
        if(!token){
            res.json({
                success: false,
                message: INVALID_TOKEN_FORMAT
            })
        }else{
            try{
                const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
                req.user = decoded;
                // console.log("Authenticated.")
                next();
            }catch(err){
                res.json({
                    success: false,
                    message: INVALID_TOKEN,
                    data : err
                })
                console.log(err)
            }
        }
    }else{
        res.json({
            success: false,
            message: NO_TOKEN
        })
    }
}

module.exports = auth;
