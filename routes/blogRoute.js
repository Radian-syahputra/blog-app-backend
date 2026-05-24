import express from 'express'
import { CreateBlogController, DeleteBlogController, GetBlogByIdController, GetBlogsController, UpdateBlogController } from '../controllers/blogController.js'
import authorizeRole from '../middleware/authorizeRole.js'
import { upload } from '../middleware/upload.js'
import verifyToken from '../middleware/verifyToken.js'

const router = express.Router()

router.post('/', verifyToken, authorizeRole('creator'), upload.single('thumbnail'), CreateBlogController)
router.get('/', GetBlogsController)
router.get('/:id', GetBlogByIdController)
router.put('/:id', verifyToken, authorizeRole('creator'), upload.single('thumbnail'), UpdateBlogController)
router.delete('/:id', verifyToken, authorizeRole('creator'), DeleteBlogController)

export default router
