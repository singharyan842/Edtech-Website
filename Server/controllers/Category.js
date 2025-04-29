
const Category = require("../models/cateogry")

//create tag handler function
exports.createCategory = async (req, res) => {
    try{
        //fetch data 
        const {name, description} = req.body

        //validation
        if(!name){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        //create entry in db
        const cateogryDetails = await Category.create({
            cateogryName: name,
            description: description
        })
        console.log(cateogryDetails)

        return res.status(200).json({
            success: true,
            message: "Cateogry created successfully"
        })

    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


//get all tags
exports.showAllCategories = async (req, res) => {
    try{
        const allCategorys = await Category.find({}, {cateogryName: true, description: true}); //means we want to get all cateogry but make sure all have name and description
        res.status(200).json({
            success: true,
            data: allCategorys,
        })

    }catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

//categoryPageDetails 

exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
      console.log("PRINTING CATEGORY ID: ", categoryId);
      // Get courses for the specified category
      const selectedCategory = await Category.findById(categoryId)
        .populate("courses")
        .exec()
  
      //console.log("SELECTED COURSE", selectedCategory)
      // Handle the case when the category is not found
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      
      //get courses for different cateogories
      const differentCategories = await Category.find({
                                        _id: {$ne: categoryId},
                                      })
                                      .populate("courses")
                                      .exec()
      
      //get top selling courses
      const allCategories = await Category.find()
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: {
            path: "instructor",
        },
        })
        .exec()
      const allCourses = allCategories.flatMap((category) => category.courses)
      const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)

      return res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategories
        }
      })
      } 
    catch(err){
      return res.status(500).json({
        success: false,
        message: err.message
      })
    }
  }