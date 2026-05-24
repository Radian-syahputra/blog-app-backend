import mongoose from "mongoose";



const blockSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['text', 'image'],
        required: true
    },
    value: {
        type: String,
        required: true
    }
})

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
    },
    thumbnail: {
        type: String,
    },
    content: {
        type: [blockSchema],
        required: true
    },
    category: {
        type: String,
        trim: true,
        default: 'general'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

const Blog = mongoose.model('Blog', blogSchema)

export default Blog