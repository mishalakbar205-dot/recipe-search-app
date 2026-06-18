import express from 'express'

import cors from 'cors'
import morgan from 'morgan'
import connectDB from './config/db.js'
import recipeRoutes from './routes/recipeRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import userRoutes from './routes/userRoutes.js'
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Create folder "uploads"
import fs from 'fs'
if(!fs.existsSync('uploads')) fs.mkdirSync('uploads');

//import "./models/categoryModel.js"

import dotenv from 'dotenv';
dotenv.config();

console.log("MONGO_URI:", process.env.MONGO_URI); // debug

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


//Middleware  // cors ---> Vite default port is 5173
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));


app.use(morgan('dev'));

// serve upload images statically
app.use('/uploads',express.static('uploads'));

app.use('/api/recipes', recipeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', userRoutes )

// Test route
app.get('/', (req,res) =>{
    res.send("API is running....");
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    
    console.log(`Server running on PORT ${PORT}`);
})
