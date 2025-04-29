const Section = require("../models/Section")
const Course = require("../models/Course")

exports.createSection = async(req, res) => {
    try{
        //data fetch
        const {sectionName, courseId} = req.body;
        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "Missing properties"
            })
        }

        //create section
        const newSection = await Section.create({sectionName})

        //update this section in course schema (add object id of section in course)
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                            courseId,
                                            {
                                                $push:{
                                                    courseContent: newSection._id
                                                }                                                
                                            },
                                            {new: true}
                                            ).populate({
                                                path: "courseContent",
                                                populate: {
                                                  path: "subSection",
                                                },
                                              })
                                              .exec()
        //HW: use populate to replace section/sub-section both in the updatedCourseDetails
        //return respone
        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourseDetails
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Unable to create section, please try again",
            error: err.message
        })
    }
}

//update section
exports.updateSection = async(req, res) => {
    try{
        //fetch data
        const {sectionName, sectionId} = req.body
        //data validattion
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "Missing properties"
            })
        }

        //update data
        //get data using section id and update
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new: true})

        //return res
        return res.status(200).json({
            success: true,
            message: "Section updated successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Unable to update section, please try again",
            error: err.message
        })
    }
}

//delete section
exports.deleteSection = async(req, res) => {
    try{
        //fetch section id to delete(assuming that we are sending id in Params)
        const {sectionId} = req.params

        //use findByIdAndDelete
        await Section.findByIdAndDelete(sectionId)

        //TODO: Do we need to delete the Entry from Course schema
        
        //return res
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Unable to delete section, please try again",
            error: err.message
        })
    }
}