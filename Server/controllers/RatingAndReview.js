const mongoose = require("mongoose")
const RatingAndReview = require("../models/RatingAndReview")
const Course = require("../models/Course")

//create Rating
exports.createRating = async(req, res) => {
    try{
        //get user id
        const userId = req.user.id

        //fetch data from user body
        const {rating, review, courseId} = req.body

        //check if user is enrolled or not
        const courseDetails = await Course.findOne(
                                            {_id: courseId,
                                              studentEnrolled: {$elemMatch: {$eq: userId}}
                                            })
        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "Student is not enrolled in course"
            })
        }

        //check if user already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({user: userId, course: courseId})
        if(alreadyReviewed){
            return res.status(403).json({
                success: false,
                message: "Course is already reviewed by the user"
            })
        }

        //create rating review
        const ratingReview = await RatingAndReview.create({rating, review, course: courseId, user: userId})

        //update course whose rating and review is done
        const updatedCourseDetails = await Course.findByIdAndUpdate({_id: courseId}, {$push: {ratingAndReviews: ratingReview._id}}, {new: true})
        console.log(updatedCourseDetails)

        //return res
        return res.status(200).json({
            success: true,
            message: "Rating and Review Created Successfully",
            ratingReview
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


//get Avg rating
exports.getAverageRating = async(req, res) => {
    try{
        //get course id
        const courseId = req.body.courseId

        //calculate avg rating
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId) //we write like this because courseId is string before i have converted it into objectId
                },
            },
            {
                $group: {
                    //we used null because we don't know according to what i am grouping
                    _id: null,
                    averageRating: { $avg: "$rating"}
                }
            }
        ])

        //return rating
        if(result.length > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating
            })
        }

        //if no rating review exist
        return res.status(200).json({
            success: true,
            message: "Average Rating is 0",
            averageRating: 0
        })
    }

    catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


//get all ratingAndReviews

exports.getAllRating = async(req, res) => {
    try{
        
        const allReviews = await RatingAndReview.find({}).sort({rating: "desc"})
                                                            .populate({
                                                                path: "user",
                                                                select: "firstName lastName email image"
                                                            })
                                                            .populate({
                                                                path: "course",
                                                                select: "courseName"
                                                            })
                                                            .exec()
        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews
        })



    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}