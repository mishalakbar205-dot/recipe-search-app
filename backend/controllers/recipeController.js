import mongoose from "mongoose";
import Recipe from "../models/recipeModel.js";
import Category from "../models/categoryModel.js";
import path from "path";

// Get all recipes or search by name or category
export const getRecipes = async (req, res) => {
    try {
        const search = (req.query.search || req.query.query || '').trim(); // Always expect "search"
        const category = (req.query.category || '').trim();
        const and = []
        
        // if search term is provided match recipe name
        if (search) {
            // name match
            and.push({name: {$regex: search, $options: "i" }  }) 
        // category match  (if search category exists)
        const cat = await Category.findOne({name: {$regex: search, $options: 'i'}}).select('_id');
        if(cat){
            and.pop(); // remove name-only filter
            and.push({
                $or: [
                    {name: {$regex: search, $options: 'i'}},
                    {categories: cat._id}
                ]
            })
        }
    }
        if(category){
            const cat = await Category.findOne({name: {$regex: category, $options: "i"}}).select('_id')
            if(!cat) return res.json([])
                and.push({categories: cat._id})
        }
        const query = and.length ?{ $and: and} :{};
        const recipes = await Recipe.find(query).populate("categories");
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single recipe by ID
export const getRecipeById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid recipe ID" });
        }
        const recipe = await Recipe.findById(req.params.id).populate("categories");
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found!" });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new recipe
export const createRecipe = async (req, res) => {
    try {
        const { name, image, ingredients, instructions } = req.body;
        let {categories} = req.body
        console.log("Incoming recipe data: ", req.body)
        // console.log('world ')

        
        if (!name) {
            return res.status(400).json({ message: "Recipe name is required" });
        }

         // handle uploaded file (preferred) or fallback to image URL text field
         const imagePath = req.file
         ? `uploads/${req.file.filename}`
         : (image ? `uploads/${path.basename(image)}` : null);

         // Normalize ingredients: accept "a,b,c" or ["a", "b", "c"]
         const normalizedIngredients = 
         Array.isArray(ingredients)
         ? ingredients
         : (ingredients ? ingredients.split(',').map(i =>i.trim()).filter(Boolean) : [])

         // Normalize categories: accept single string or array of names
         if(typeof categories === 'string'){
            try{
                const parsed = JSON.parse(categories);
                categories = Array.isArray(parsed) ? parsed : [categories];
            }
            catch{
                categories = [categories]
            }
         } 
         if(!Array.isArray(categories)) categories = []

        // Convert category names to objectIDs
        
        
        const categoryIds = await Promise.all(
                categories.map(async (catName) =>{
                    const name = String(catName).trim()
                    if(!name) return null
                    
                    let category = await Category.findOne({name})
                    if(!category){
                        category = await Category.create({name})
                    }
                    
                    return category._id;
                })
            ).then(ids =>ids.filter(Boolean))
        
        // Create and save the recipe

        const recipe = new Recipe({
            name, 
            // cuisine: cuisine || "",
            image: imagePath,
            ingredients: normalizedIngredients,
            instructions: instructions || "",
            categories: categoryIds // Store Object IDs
        })

        const createdRecipe = await recipe.save();
        res.status(201).json(createdRecipe);
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Internal Server Error" , 
            error: error.message        });
    }
};

// Update an existing recipe
export const updateRecipe = async (req, res) => {
    try {
        const {id} = req.params
        const {name, image, ingredients, instructions} = req.body
        let {categories} = req.body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid recipe ID" });
        }

        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found!" });
        }

        if(name   !== undefined) recipe.name= name
        if(instructions !== undefined) recipe.instructions = instructions

        // ingredients can be array or comma separated
        if(ingredients !== undefined){
            recipe.ingredients = Array.isArray(ingredients)
            ? ingredients
            : (ingredients ? ingredients.split(',').map(i =>i.trim()).filter(Boolean) : [])
        }

        //  if a new image file uploaded, replace path; otherwise, keep old or accept raw URL from text field
        if(req.file){
            recipe.image = `uploads/${req.file.filename}`
        }
        else if (image !== undefined){
            recipe.image = image ? `uploads/${path.basename(image)}` : null;
        }

        // Categories can be string or array of names
        if(categories !== undefined){
            if(typeof categories === 'string'){
                try{
                    const parsed = JSON.parse(categories);
                    categories = Array.isArray(parsed) ? parsed : [categories];
                }
                catch{
                    categories = [categories]
                }
            } 
            if(!Array.isArray(categories)) categories = []

            const categoryIds = await Promise.all(
                categories.map(async (catName) => {
                    const name = String(catName).trim()
                    if(!name) return null
                    let category = await Category.findOne({name})
                    if(!category){
                        category = await Category.create({name})
                    }
                    return category._id
                })        
            ).then(ids =>ids.filter(Boolean))

            recipe.categories = categoryIds
        }

        const updated= await recipe.save();
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a recipe
export const deleteRecipe = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid recipe ID" });
        }

        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found!" });
        }

        res.json({ message: "Recipe deleted!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
