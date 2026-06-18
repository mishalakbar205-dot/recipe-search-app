import express from 'express'
import { getRecipes, getRecipeById, createRecipe,updateRecipe, deleteRecipe } from '../controllers/recipeController.js'
import upload from '../middleware/upload.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
.get(getRecipes) // GET /api/recipes
.post(protect, admin, upload.single('image'),createRecipe) 



router.route('/:id')
.get(getRecipeById)  // GET /api/recipes/:id
.put( protect, admin,upload.single('image'),updateRecipe)   
.delete( protect, admin, deleteRecipe)  // DELETE /api/recipes/:id

export default router;