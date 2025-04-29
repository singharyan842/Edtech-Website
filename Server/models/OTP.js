const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
        expires: 5*60  //expires in 5 minutes
    },
});

//a function to send email
async function sendVerificationEmail(email, otp){
    try{
      const mailResponse = await mailSender(email, "Verification Email from StudyNotion", otp)
        console.log("mail sent successfully", mailResponse);
    }
    catch(err){
        console.log("error occurred while sending mails", err);
        throw err;  
    }
}

//pre save middleware-> just before saving the document this code should run
otpSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports = mongoose.model("OTP", otpSchema);