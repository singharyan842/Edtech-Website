const mongoose = require('mongoose');
const cateogry = require('./cateogry');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
        trim: true,
    },

    courseDescription: {
        type: String,
        required: true,
        trim: true,
    },

    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    whatYouWillLearn: {
        type: String,
        required: true,
        trim: true,
    },

    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section"
        }
    ],

    ratingAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReview"
        }
    ],

    price: {
        type: Number,
        required: true,
    },

    thumbnail: {
        type: String,
        required: true,
    },

    tag: {
        type: [String],
        required: true
    },

    cateogry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cateogry",
    },

    studentEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        }
    ],

    instructions: {
        type: [String]
    },

    status: {
        type: String,
        enum: ["Draft, Published"]
    }
});


module.exports = mongoose.model("Course", courseSchema);