import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/userModel.js';

await connectDB();

const email = process.argv[2];
if(!email){
    console.log("Usage: node makeAdmin.js user@example.com");
    process.exit(1);
}
const user = await User.findOneAndUpdate({email}, {$set: {isAdmin: true}}, {new: true});
console.log("Updated:", user?.email, "isAdmin:", user?.isAdmin);
process.exit(0);