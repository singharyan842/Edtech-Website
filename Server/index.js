const express = require("express")
const app = express()

const userRoutes = require("./routes/User")
const courseRoutes = require("./routes/Course")
const paymentsRoutes = require("./routes/Payments")
const profileRoutes = require("./routes/Profile")

const database = require("./config/database")
const cookieParser = require("cookie-parser")
const cors = require("cors") //it is required beacause i want my backend to entertain my frontend request
const {cloudinaryConnect} = require("./config/cloudinary")
const fileUpload = require("express-fileupload")
const dotenv = require("dotenv")

dotenv.config()
const PORT = process.env.PORT || 4000

//connect to database
database.connect()

//middleware
app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin: "http://localhost:3000",  //because at 3000 frontend is used
        methods: "GET, POST, PUT, DELETE", // Allow specific HTTP methods
        credentials: true, 
    })
)

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/temp"
    })
)

//cloudinary connection
cloudinaryConnect()

//route mounting
app.use("/api/v1/auth", userRoutes)
app.use("/api/v1/profile", profileRoutes)
app.use("/api/v1/course", courseRoutes)
app.use("/api/v1/payment", paymentsRoutes)


//default route
app.get("/", (req,res) => {
    return res.json({
        success: true,
        message: "Your server is up and running...."
    })
})

app.listen(PORT, ()=>{
    console.log(`App is running at ${PORT}`)
})


