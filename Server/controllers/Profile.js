const { deleteModel } = require("mongoose");
const Profile = require("../models/Profile")
const User = require("../models/User")
const {uploadImageToCloudinary} = require("../utils/imageUploader")

exports.updateProfile = async(req, res) => {
    try{
        //get data
        //dateOfBirth = "" -> it means that if you give then it okay otherwise it is empty(optional field)
        const {dateOfBirth="", about="", contactNumber, gender} = req.body

        //get userId
        //The user id is in req.user beacuse in auth middleware i have given the the decoded jwt in req.user
        console.log(req.user)
        const id = req.user.id;

        //validate data
        if(!contactNumber|| !gender || !id){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        //find profile which have to updated
        const userDetails = await User.findById(id)
        const profileId = userDetails.additionalDetails
        //get all the data of profile by profileId
        const profileDetails = await Profile.findById(profileId)

        //update profile
        profileDetails.dateOfBirth = dateOfBirth
        profileDetails.about = about
        profileDetails.contactNumber = contactNumber
        profileDetails.gender = gender
        //we are using here save function to save data in DB because here object is already created you don't have to create it again
        await profileDetails.save();

        //return res
        return res.status(200).json({
            success: true,
            message: "profile Updated successfully",
            profileDetails
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            error: err.message
        })
    }
}


//delete account
exports.deleteAccount = async(req, res) => {
    try{
        //get id
        const id = req.user.id

        //validation
        const userDetails = await User.findById({id})
        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        //delete user profile
        await Profile.findByIdAndDelete({_id: userDetails.additionalDetails})

        //TODO(HW): unenroll user from all enrolled courses

        //delete user
        await User.findByIdAndDelete({_id:id})

        //return res
        return res.status(200).json({
            success: true,
            message: "User Deleted successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "User cannot be deleteModel, successfully"
        })

    }
}

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }


exports.getAllUserDetails = async(req,res) => {
    try{
        //get id
        const id = req.user.id

        //validation and get your user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec()

        //get user details
        return res.status(200).json({
            success: true,
            message: "User data fetched successfully",
            data: userDetails
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}