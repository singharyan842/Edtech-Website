
const Course = require("../models/Course")
const Category = require("../models/cateogry")
const User = require("../models/User")
//for course thumbnail we require to upload image like on cloudinary so we require imageUploader function
const {uploadImageToCloudinary} = require("../utils/imageUploader")

//createCourse handler function
exports.createCourse = async(req, res) => {
    try{

        //fetch data
        const {courseName, courseDescription, whatYouWillLearn, price, category} = req.body;

        //thumbnail
        const thumbnail = req.files.thumbnailImage

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail){
            return res.status().json({
                success: false,
                message: "All Fields Are Required"
            })
        }

        //instructor -> because if see in course model we need to store instructor object id by DB call
        const userId = req.user.id
        const instructorDetails = await User.findById(userId);
        console.log("Intructor details: ", instructorDetails);

        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message: "Instructor details not found"
            })
        }

        //check given tag is valid or not
        const cateogryDetails = await Category.findById(category);
        if(!cateogryDetails){
            return res.status(404).json({
                success: false,
                message: "Tag details not found"
            })
        }

        //upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)

        //create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            cateogry: cateogryDetails._id,
            thumbnail: thumbnailImage.secure_url
        })

        //add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id}, //found the user by id
            {
                $push:{
                    courses: newCourse._id,  //and pushed new course id in courses array of the instructor
                }
            },
            {new: true}
        )


        //update the Cateogry schema
        await Category.findByIdAndUpdate(
            {_id: cateogryDetails._id},
            {
                $push:{
                    courses: newCourse._id
                }
            },
            {new: true}
        )

        //return response
        return res.status(200).json({
            success: true,
            message: "Courses created successfully",
            data: newCourse
        })

    }catch(err){
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Failed to create the course",
            error: err.message
        })

    }
}


//getAllCourse
exports.showAllCourses = async(req, res) => {
    try{

        //TODO
        const allCourses = await Course.find({})

        return res.status(200).json({
            success: true,
            message: "Data for all Courses fetched successfully",
            data: allCourses
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Cannot fetch course data",
            error: err.message
        })
    }
}

//get course details
exports.getCourseDetails = async(req, res) => {
    try{
        //get course id
        const {courseId} = req.body

        //find course details
        const courseDetails = await Course.find(
                                    {_id:courseId})
                                    .populate(
                                        {
                                            path: "instructor"
                                            .populate(
                                                {
                                                    path: "additionalDetails"
                                                }
                                            )
                                        }
                                    )
                                    .populate("cateogry")
                                    .populate("ratingAndreviews")
                                    .populate({
                                        path: "courseContent"
                                        .populate(
                                            {
                                                path: subSection
                                            }        
                                        )
                                    })
                                    .exec()
        //VALUIDATION
        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: `Could not find the course with ${courseId}`
            })
        }

        return res.status(200).json({
            success: true,
            message: "Course Details fetched successfully",
            data: courseDetails
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
