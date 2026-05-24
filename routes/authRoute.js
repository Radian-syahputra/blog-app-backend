import express from "express";
import { LoginUserController, LogoutUserController, MeController, RegisterUserController } from "../controllers/authController.js";
import verifyToken from '../middleware/verifyToken.js'


const router = express.Router()

router.post('/register', RegisterUserController)
router.post('/login', LoginUserController)
router.post('/logout', LogoutUserController)
router.get('/me', verifyToken, MeController)

export default router