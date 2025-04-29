
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const bcrypt = require("bcrypt")
const crypto = require("crypto");

//resetPasswordToken -> used to store the token which is sent to the user's email
exports.resetPasswordToken =  async(req, res) => {
    try{
        //get email form req body
        const email = req.body.email
    
        //check user for this email, email validation
        const user = await User.findOne({email: email})
        if(!user){
            return res.json({
                message: "Your Email is not registered with us"
            })
        }
    
        //generate token
        const token = crypto.randomBytes(20).toString("hex");
    
        //update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
                                        {email: email},
                                        {
                                            token: token,
                                            resetPasswordExpires: Date.now() + 5*60*1000
                                        },
                                        {new: true} 
                                        )
    
        //create url
        const url = `http://localhost:3000/update-password/${token}` //${token} will help in generating different link otherwise we will hwve the same link
        
        //send mail containing the url
        await mailSender(email, "Password Reset Link", `Password Reset Link ${url}`)
    
        //return response
        return res.json({
            success: true,
            message: "Email sent Successfully please check email and change Password"
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending reset password mail"
        })

    }

    
}

//resetPassword-> for updating password in the database
exports.resetPassword = async(req, res) => {
    try{
        //fetch data
        //we have not given token in our request then how it got there?
        //ans-> frontend have kept it in request from the link in line 33
        const {password, confirmPassword, token} = req.body
    
        //validation
        if(password !== confirmPassword){
            return res.json({
                success: false,
                message: "Password is Not Matching"
            })
        }
    
        //get userDetails from db using token
        const userDetails = await User.findOne({token: token})
    
        //if no entry-> Invalid Token
        if(!userDetails){
            return res.json({
                success: false,
                message: "Token is invalid"
            })
        }
    
        //token time limit
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success: false,
                message: "Token is expired please regenerate your password"
            })
        }
    
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10)
    
        //update password
        await User.findOneAndUpdate(
            {token: token},
            {password: hashedPassword},
            {new: true}
        )
    
        //return response
        return res.status(200).json({
            success: true,
            message: "Password reset successful"
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while reseting password"
        })

    }
}

