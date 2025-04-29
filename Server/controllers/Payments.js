const {instance} = require("../config/razorpay")
const Course = require("../models/Course")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail")
const {default: mongoose} = require("mongoose")

//capture the payment and initiate the razorpay order
exports.capturePayment = async (req, res) => {

        //get courseId and userId
        const {course_id} = req.body
        const userId = req.user.id

        //validation
        //valid courseId
        if(!course_id){
            return res.json({
                success: false,
                message: "Please Provide valid Course_ID"
            })
        }

        //valid courseDetail
        let course;
        try{
            course = await Course.findById(course_id)
            if(!course){
                return res.json({
                    success: false,
                    messsage: "Could not find the course"
                })
            }
            //user already paid for the course
            //convert userId which is in string to object id
            const uid = new mongoose.Types.ObjectId(userId)
            if(course.studentEnrolled.includes(uid)){
                return res.status(200).json({
                    success: false,
                    message: "Student is already enrolled"
                })
            }
        }
        catch(err){
            console.error(err)
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }

        //create order
        const amount = course.price
        const currency = "INR"

        const options = {
            amount: amount*100,
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes: {
                courseId: course_id,
                userId
            }
        }

        try{
            //initiate the payment using razorpay
            const paymentResponse = await instance.orders.create(options)
            console.log(paymentResponse)
        }
        catch(err){
            console.log(err)
            return res.json({
                success: false,
                message: "Could not initaite order"
            })
        }

        //return response
        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount
        })
}


//Authorization of payment -> (verify signature of razorpay and server)
//we have to match secret in server and razorpay secret
exports.verifySignature = async(req, res) => {
    //server secret
    const webhookSecret = "12345678"

    //razorpay secret
    const signature = req.headers["x-razorpay-signature"]

    //hash the server webhookSecret and match it with the hashed signature
    //Hmac -> Hashed based message Authentication code
    //Hmac is combination of Hashing algo and Secret Key. 
    //SHA -> secure hashing algorithm
    //sha256 -> Hashing algo
    //webhookSecret -> Secret Key
    const shasum = crypto.createHmac("sha256", webhookSecret) //Hmac Object

    //convert Hmac object to string
    shasum.update(JSON.stringify(req.body))

    //when we run a hashing algo on input then sometimes we call its output as Digest which is ggenerally in hexadecimal format
    const digest = shasum.digest("hex")

    //match signature and digest
    if(signature === digest){
        console.log("Payment is Authorized")

        //now if authentication is completed then student should get the course
        //So update in User's course Array course id
        //and also update in course student enrolled array

        //so we have used courseId in notes while creating order
        const {courseId, userId} = req.body.payload.payment.entity.notes

        try{
            //fulfill the action

            //find the course and enroll student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                                                {_id: courseId},
                                                {$push: {studentEnrolled: userId}},
                                                {new: true}
            )

            if(!enrolledCOurse){
                return res.status(500).json({
                    success: false,
                    message: "Course Not found"
                })
            }

            console.log(enrolledCourse)

            //find the student and add the course in list of enrolled courses
            const enrolledStudent = await User.findOneAndUpdate(
                                            {_id: userId},
                                            {$push: {courses: courseId}},
                                            {new: true}
            )

            console.log(enrolledStudent)

            //confirmation mail to be sent
            const emailResponse = await mailSender(enrolledStudent.email, "Congratulation from Codehelp", "Congrutulations, You are onboarded")

            console.log(emailResponse)
            return res.status(200).json({
                success: true,
                message: "Signature verified and Course Added"
            })
        }
        catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }
    else{
        return res.status(400).json({
            success: false,
            message: "Invalid request"
        })
    }

}

    
