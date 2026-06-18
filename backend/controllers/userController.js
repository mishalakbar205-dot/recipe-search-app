import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";


        // generate token
        const getToken = (user) =>{
            if(!process.env.JWT_SECRET){
                console.error("JWT secret not set");
                throw new Error("JWT secret not configured");
            }
    return jwt.sign({id: user._id, isAdmin: user.isAdmin},process.env.JWT_SECRET, {expiresIn: "7d"});
}


export const register = async (req, res) =>{
    try{
        const {name, email, password} = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({message: "Name, email and password are required."});
        }

        // check for duplicate email
        const existing = await User.findOne({email});
        if(existing) return res.status(400).json({message: "Email already registered"});

        // check for duplicate username
        const existingName = await User.findOne({name});
        if (existingName){
            return res.status(400).json({message: "Username already taken"});
        }

         // hashed password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

         // create new user
        const newUser = await User.create({name, 
            email,
            passwordHash})


   
        return res.status(201).json({
           success: true,
           message: "User registered successfully",
        })
    }
    catch(error){
        console.error("Register error:", error);
        return res.status(500).json({message: error.message || "Server Error"})
    }
};

export const login = async (req, res) =>{
    try{
        const {email, password} = req.body;
        console.log("Login request body:", req.body);

        const user = await User.findOne({email});
        console.log("Found user:", user);
        if(!user) return res.status(401).json({message:"Invalid credentials" });

        const ok = await bcrypt.compare(password, user.passwordHash);
           console.log("Password match:", ok);
        if(!ok) return res.status(401).json({message: "Invalid credentials" });

        return res.json({
            success : true,
            message : "Login successful",
            token: getToken(user),
        });
   
    }
    catch(error){
        console.error("Login error: ", error);
        return res.status(500).json({message: error.message || "Server Error"})
    }
    
};

export const me = async(req, res) =>{
    return res.json({user: req.user});
};