import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';


export const CreateComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { blogId } = req.params;

        if(!content) {
            return res.status(400).json({
                message: "Content is required"
            });
        }

        const blog = await Blog.findById(blogId);
        if(!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        const comment = await Comment.create({
            content,
            blog: blogId,
            author: req.user._id
        })

        return res.status(201).json({
            message: "Comment created successfully",
            comment
        })


    } catch (error) {
        res.status(500).json({
            message: "Error creating comment",
            error: error.message
        });
    }
}

export const GetCommentsByBlogId = async (req, res) => {
    try {
        const { blogId } = req.params;

        const comments = await Comment.find({blog : blogId}).populate('author', 'username email').sort({createdAt: -1});

        return res.status(200).json({
            message: "Comments fetched successfully",
            comments
        })
        
    } catch (error) {
        return res.status(500).json({
            message : "Error fetching comments",
            error: error.message
        })
    }
}

export const DeleteComment = async (req, res) => {
    try {

        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);

        if(!comment) {
            return res.status(404).json({
                message : "Comment Not Found"
            })
        }
        
        if(comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message : "Unauthorized to delete this comment"
            })
        }

        await Comment.findByIdAndDelete(commentId);
        
        return res.status(200).json({
            message: "Comment deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message : "Error deleting comment",
            error: error.message
        })
    }
}