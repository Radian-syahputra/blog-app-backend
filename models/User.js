import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    }, 
    password: {
        type: String,
        required: true,
        minLength: [6, 'Password must be at least 6 characters long']
    },

    role : {
        type : String,
        enum : ['user', 'creator'],
        default : 'user'
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)

export default User