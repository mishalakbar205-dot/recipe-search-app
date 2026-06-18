import mongoose from "mongoose";
import Category from "../models/categoryModel.js";

// Get all categories
export const getCategories = async(req,res) =>{
    try{
        const categories = await Category.find();
        res.json(categories);
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
};

// Create category
export const createCategory = async(req,res) =>{
    try{
        const category = new Category(req.body)
        const createdCategory = await category.save()
        res.status(201).json(createdCategory)
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
};

// UPDATE Category
export const updateCategory = async(req,res) =>{
    try{
        const category = await Category.findById(req.params.id)
        if(category){
            Object.assign(category, req.body)
            const updatedCategory = await category.save()
            res.json(updatedCategory);
        }
        else{
            res.status(404).json({message: "Category not found!"})
        }
    }
    catch(error){
        res.status(400).json({message: error.message});
    }
}

// DELETE Category
export const deleteCategory = async(req,res) =>{
    try{
        if (!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({message: "Invalid category ID"});
        }
        const category = await Category.findById(req.params.id);
        if(category){
           await category.deleteOne();
           res.json({message: "Category deleted!"})
        }
        else{
            res.status(404).json({message: "Category not found!"})
        }
    }
    catch(error){
        console.error("Delete Category Error: ", error);
        res.status(500).json({message: error.message});
    }
}