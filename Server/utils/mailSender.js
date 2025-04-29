//package to send mail -> nodemailer
const nodemailer = require('nodemailer');
require('dotenv').config();

//function to send mail
//we used async beacause mail sending is a time taking process
const  mailSender = async (email, title, body) => {
    try{
        // create trnsporter object
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        //send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'StudyNotion - by Aryan',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });
        console.log(info);
        return info; //if anyone wants to use the information of the mail
    }
    catch(err){
        console.log(err.message);
    }
}

module.exports = mailSender;