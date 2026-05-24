import express from "express";
import { LoginUserController, LogoutUserController, RegisterUserController } from "../controllers/authController.js";

const router = express.Router()

router.post('/register', RegisterUserController)
router.post('/login', LoginUserController)
router.post('/logout', LogoutUserController)

export default router