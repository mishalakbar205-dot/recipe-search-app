import mongoose from "mongoose";

const recipeSchema = mongoose.Schema({
    name: {type: String, required: true},
    cuisine: {type: String},
    image: {type: String},
    ingredients: [String],
    instructions:  String,
    categories: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
}, {    
    timestamps: true,
});

const Recipe = mongoose.model('Recipe',recipeSchema)
export default Recipe; 