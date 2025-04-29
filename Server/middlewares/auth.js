const jwt = require("jsonwebtoken")
require("dotenv").config();
const User = require("../models/User")

//auth
exports.auth = async (req, res, next) => {
    try{

        //extract token
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ", "");


        //if token is missing return response
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is Missing"
            })
        }

        //verify the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            console.log(decode);
            req.user = decode

        }catch(err){
            return res.status(401).json({
                success: false,
                message: "Token is Invalid"
            })

        }
        next()

    }catch(err){
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token"
        })

    }
}

//isStudent
exports.isStudent = async(req, res, next) => {

    try{

        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for student only"
            })
        }

        next()

    }catch(err){
        return res.status(500).json({
            success: false,
            message: "User Role cannot be verified"
        })
    }

}

//isInstructor
exports.isInstructor = async(req, res, next) => {

    try{

        if(req.user.accountType !== "Instrucor"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for instructor only"
            })
        }
        next()

    }catch(err){
        return res.status(500).json({
            success: false,
            message: "User Role cannot be verified"
        })
    }

}

//isAdmin
exports.isAdmin = async(req, res, next) => {

    try{

        if(req.user.accountType !== "admin"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Admin only"
            })
        }
        next()

    }catch(err){
        return res.status(500).json({
            success: false,
            message: "User Role cannot be verified"
        })
    }

}
