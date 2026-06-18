import jwt from "jsonwebtoken";
import User from "../models/userModel.js";


export const protect = async (req, res, next) =>{
    const auth = req.headers.authorization;
    if(auth && auth.startsWith("Bearer ")){
        try{
            const token = auth.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-passwordHash");
            if(!req.user) return res.status(401).json({message: "User not found!" });
            return next();
        }
        catch(error){
            return res.status(401).json({message: "Not authorized, token failed"});
        }
    }
    return res.status(401).json({message: "Not authorized, no token"});
};
export const admin = (req,res, next) =>{
    if(req.user && req.user.isAdmin) return next();
    return res.status(403).json({message: "Admin access required"});
}
