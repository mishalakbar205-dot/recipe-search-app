import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true, trim: true},
     email: {type: String, required: true, unique: true, lowercase: true, index: true, trim: true},
    passwordHash: {type: String, required: true},
    isAdmin: {type: Boolean, default: false},
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;