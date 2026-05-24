import Blog from "../models/Blog.js";
import { upload, uploadBufferToCloudinary, uploadBase64ToCloudinary } from '../middleware/upload.js'



export const CreateBlogController = async (req, res) => {
    try {
        const { title, subtitle, category } = req.body
        const content = JSON.parse(req.body.content)

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            })
        }

        const author = req.user._id
        let thumbnailUrl = ''

        // ✅ ganti uploadToCloudinary -> uploadBufferToCloudinary
        if (req.file) {
            thumbnailUrl = await uploadBufferToCloudinary(req.file.buffer, 'thumbnails')
        }

        const processedContent = await Promise.all(
            content.map(async (block) => {
                if (block.type === 'image') {
                    // ✅ ganti uploadToCloudinary -> uploadBase64ToCloudinary
                    const imageUrl = await uploadBase64ToCloudinary(
                        block.value,
                        'blogs'
                    )
                    return { type: 'image', value: imageUrl }
                }
                return block
            })
        )

        const newBlog = await Blog.create({
            title: title,
            subtitle: subtitle,
            thumbnail: thumbnailUrl,
            category: category,
            content: processedContent,
            author: author
        })

        res.status(201).json({
            message: "Blog created successfully",
            blog: newBlog
        })

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong while creating the blog",
            error: error.message
        })
    }
}

export const GetBlogsController = async (req, res) => {
    try {
        const { search, category } = req.query
        const filter = {}

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { subtitle: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ]
        }

        if (category) {
            filter.category = { $regex: category, $options: 'i' }
        }

        const blogs = await Blog.find(filter).populate('author', 'username email').sort({ createdAt: -1 })

        if (blogs.length === 0) {
            return res.status(404).json({
                message: "No blogs found please create some blogs"
            })
        }

        res.status(200).json({
            message: "Blogs fetched successfully",
            blogs: blogs
        })

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong while fetching the blogs",
            error: error.message
        })
    }
}

export const GetBlogByIdController = async (req, res) => {
    try {
        const blogId = req.params.id
        const blog = await Blog.findById(blogId).populate('author', 'username email')

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            })
        }

        res.status(200).json({
            message: "Blog fetched successfully",
            blog: blog
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong while fetching the blog",
            error: error.message
        })
    }
}


export const UpdateBlogController = async (req, res) => {
    try {
        const blogId = req.params.id
        const { title, subtitle, category } = req.body
        const content = req.body.content ? JSON.parse(req.body.content) : null

        // Cek apakah blog ada
        const blog = await Blog.findById(blogId)
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            })
        }

        // Cek apakah user yang mengupdate adalah author dari blog
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Forbidden -- You don't have permission to update this blog"
            })
        }

        // ✅ Jika ada thumbnail baru, upload ke Cloudinary
        let thumbnailUrl = blog.thumbnail
        if (req.file) {
            thumbnailUrl = await uploadBufferToCloudinary(req.file.buffer, 'thumbnails')
        }

        // ✅ Looping content kalau ada content baru
        let processedContent = blog.content
        if (content) {
            processedContent = await Promise.all(
                content.map(async (block) => {
                    if (block.type === 'image' && block.value.startsWith('data:')) {
                        const imageUrl = await uploadBase64ToCloudinary(block.value, 'blogs')
                        return { type: 'image', value: imageUrl }
                    }
                    return block
                })
            )
        }

        const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            title: title || blog.title,
            subtitle: subtitle || blog.subtitle,
            category: category || blog.category,
            thumbnail: thumbnailUrl,
            content: processedContent
        }, { returnDocument: 'after' }).populate('author', 'username email')

        res.status(200).json({
            message: "Blog updated successfully",
            blog: updatedBlog
        })

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong while updating the blog",
            error: error.message
        })
    }
}

export const DeleteBlogController = async (req, res) => {
    try {

        const blogId = req.params.id
        const blog = await Blog.findById(blogId)

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            })
        }

        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Forbidden -- You don't have permission to delete this blog"
            })
        }

        const deletedBlog = await Blog.findByIdAndDelete(blogId)

        res.status(200).json({
            message: "Blog deleted successfully",
            blog: deletedBlog
        })

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong while deleting the blog",
            error: error.message
        })
    }
}