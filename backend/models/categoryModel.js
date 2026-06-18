import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name: {type: String, required: true},
    color: {type: String}, // for label color
}, {
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema);
export default Category;