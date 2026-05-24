import express from 'express'
import { CreateComment, DeleteComment, GetCommentsByBlogId } from '../controllers/commentController.js'
import verifyToken from '../middleware/verifyToken.js'


const router = express.Router()

router.post('/:blogId/comments', verifyToken, CreateComment)
router.get('/:blogId/comments', GetCommentsByBlogId)
router.delete('/comments/:commentId', verifyToken, DeleteComment)


export default router