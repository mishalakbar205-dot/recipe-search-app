import dotenv from "dotenv";
dotenv.config();


import connectDB from "../config/db.js";
import Recipe from "../models/recipeModel.js";
import Category from "../models/categoryModel.js";
import sampleRecipes from "./sampleRecipes.js";
import sampleCategories from "./sampleCategories.js";


connectDB();

const seedData = async () =>{
    try{
        await Recipe.deleteMany();
        await Category.deleteMany();

        const createdCategories = await Category.insertMany(sampleCategories);

        // Assign categories to recipes by matching cuisine name
        const recipesWithCategories = sampleRecipes.map((recipe) =>{
            const category = createdCategories.find(cat => cat.name === recipe.cuisine);
            return{
                ...recipe,
                categories: category ? [category._id] : [],
            };
        });
        await Recipe.insertMany(recipesWithCategories);

        console.log("Database seeded successfully!");
        process.exit();
    }
    catch(error){
        console.error("Error seeding data:", error)
        process.exit(1);
    }
}
seedData();