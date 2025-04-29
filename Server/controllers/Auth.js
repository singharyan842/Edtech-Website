const bcrypt = require("bcryptjs")
const User = require("../models/User")
const OTP = require("../models/OTP")
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")
const mailSender = require("../utils/mailSender")
const { passwordUpdated } = require("../mail/templates/passwordUpdate")
const { otpTemplate } = require("../mail/templates/emailVerificationTemplate")
const Profile = require("../models/Profile")
require("dotenv").config()


//sendOTP
exports.sendOTP = async (req, res) => {
   
    try {
      //we have used curly braces to destructure the email from the request body
      //if write const email = req.body then we have to write email.email
      const {email} = req.body;
  
      //check user already exists or not in the database
      const checkUserPresent = await User.findOne({email});
  
      //if user exists then send error message
      if(checkUserPresent){
          return res.status(401).json({
              success: false,
              message: "User already exists"
          });
      }

      //generate OTP 
      //we used var instead of const because we are going to reassign the value of otp.
      let otp = otpGenerator.generate(6, {upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false});
      console.log("OTP generated ", otp);


      //make sure OTP is unique
      const checkOTP = await OTP.findOne({otp: otp});
      
      //if OTP is not unique then generate OTP again
      //this is not a good code because it checking in DB again and again
      while (await OTP.findOne({ otp })) {  // ✅ Proper way to check in loop
        otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
        console.log("New OTP generated:", otp);
    }

      //make entry of generated entry in database
      //we have not given createdAt in otpPayload because in model we have given it default value Date.now()
      const otpPayload = {email, otp};
      const otpBody = await OTP.create(otpPayload);
      console.log(otpBody)

      try {
        const emailResponse = await mailSender(
            email,
            "Your OTP Code",  // ✅ Adding a proper subject
            otpTemplate(otp)   // ✅ Passing the email body separately
        );
        console.log("OTP Email Sent Successfully:", emailResponse.response);
    } catch (error) {
        console.error("Error Sending OTP Email:", error);
        return res.status(500).json({
            success: false,
            message: "Error sending OTP email",
        });
    }
    
      //return response
      return res.status(200).json({
          success: true,
          message: "OTP sent successfully",
      });


    }
    catch(err){
      console.log("error occurred while sending OTP", err);
      return res.status(500).json({
          success: false,
          message: "Internal server error"
      });
    }
    


}

//signup
exports.signUp = async(req, res) => {

    try{

        //Fetch data from request ki body
        console.log(req.body)
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;
    
        //validate krlo
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }
    

    
        //match 2 password -> 1.password 2.confirm password
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: 'Password and Confirm Password Value does not match, please try again'
            })
        }
    
        //check user exists or not
        const existingUser = await User.findOne({email})
        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is already Registered"
            })
        }
    
        //find most recent OTP stored for user
        const recentOtp = await OTP.find({email}).sort({createdAt: -1}).limit(1) //it can give multiple entry corresponding to the email but i want recent one so use .sort
        console.log(recentOtp);

        // If there’s an OTP in the database, recentOtp will look like this:
        //  [
        //    {
        //      "_id": "65a1bcdef123",
        //      "email": "user@example.com",
        //      "otp": "123456",
        //      "createdAt": "2025-02-19T12:00:00Z"
        //    }
        //  ]
        // recentOtp[0].otp will give the otp field of the array of recentOtp with only one element in otp

    
        //validate otp->input otp and database otp
        if(recentOtp.length === 0){
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid"
            })
        } else if(otp !== recentOtp[0].otp){
            return res.json({
                success: false,
                message: "The OTP is not valid"
            })
        }
    
        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword)

        //create the user
        let approved = ""
        approved = "Instructor"? (approved=false) : (approved = true)
    
        //Create the Additional Profile For user
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        })
    
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType: accountType,
            approved: approved,
            additionalDetails : profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}` //api from dicebear used to create img from first letter of first name and 1st letter of last name.
        })
    
        //return res
        return res.status(200).json({
            success: true,
            message: "User is registered successfully",
            user
        })

    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again"
        })

    }


}

//login
exports.login = async (req, res) => {
    try{
        //get data from req body
        const {email, password} = req.body;

        //validation of data
        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: "Please fill up all the required fields"
            })
        }

        //check user exits or not
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User is not registered, please signUp first"
            })
        }

        //generate jwt token, after matching the password
        if(await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType
            }
            //sign method used to create jwt token
            //Signing the JWT:
            //    When a server creates a JWT, it signs it using the secret key (JWT_SECRET).
            //    This ensures that no one can tamper with the token without knowing the secret.
            //Verifying the JWT:
            //    When the client sends back the token, the server uses the same secret key to verify it.
            //    If the token was modified in any way, verification will fail.
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2hr"
            })
            user.token = token
            user.password = undefined

            //create cookie and send response
            const options = {
                expires: new Date(Date.now()+ 3*24*60*60*1000),
                httpOnly: true
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successfully"
            })

        }

        else{
            return res.status(401).json({
                success: false,
                message: "Password is in correct"
            })
        }


        

    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Login failure please try again"
        })
    }
}

//change password
exports.changePassword =async(req,res) =>{
    try{
        //get data form req body
        //When a user successfully logs in, we generate a JWT token
        //The token is stored in the browser as a cookie or sent in the response
        //The frontend (React, Postman, etc.) includes the JWT token in the request headers

        //Before reaching the controller (changePassword), the authentication middleware runs:
        //   ->Extract token from the Authorization header
        //   ->Verify and decode token
        //   ->Attach the decoded user data to req.user

        //so like this the req.user get all the data from token

        const userDetails = await User.findById(req.user.id);


        //get old password,new password,confirmNewPassword
        const { oldPassword, newPassword, confirmNewPassword } = req.body;


        //validate old password
        //oldPassword -> User's input (plain text)
        //userDetails.password -> Hashed password stored in the database
        const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
        if(!isPasswordMatch){
            //if password is not matched return a unauthorized error 401
            return res.status(401).json({
                success:false,
                message: "The password is incorrect",
            });
        }


        // Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}


        //update password in DB
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);


        //send mail
        try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}


       //return response
       return res.status(200).json({
        success:true,
        message: "Password updated successfully",
       });
    }

    catch(error){


        // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
    }
   
}