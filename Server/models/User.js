const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,   //trim->remove whitespace
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, //unique email
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    accountType:{
        type: String,
        enum: ["admin", "student", "instructor"],
        required: true,
    },
    
    //additionalDetails-> It refers to the profile model
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Profile"  //profile: model name
    },

    //courses-> It refers to the course model
    //[]->array of courses
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "course"  //course: model name
        }
    ],

    //user image
    image: {
        type: String, //used string because it is image url
        required: true,
    },
    
    token: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date
    },

    //courseProgress-> It is used because we want to track the progress of the user in the course
    //we have created model for course progress because we want to store the progress of the user in the course and whenever we want to store the progress of the user in the course, we will create a new document in the courseProgress model
    courseProgress: [ 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "courseProgress"
        }
    ],
});

module.exports = mongoose.model("User", userSchema); //user: model name