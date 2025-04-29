const mongoose = require('mongoose');

const cateogrySchema = new mongoose.Schema({
    cateogryName: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        required: true,
        trim: true,
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }

});

module.exports = mongoose.model("Cateogry", cateogrySchema);