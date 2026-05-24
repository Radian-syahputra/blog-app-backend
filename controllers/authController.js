import User from "../models/User.js"
import bcrypt from 'bcrypt'
import generateToken from "../config/generateToken.js"

export const RegisterUserController = async (req, res) => {
    try {
        const { username, email, password } = req.body


        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            })
        }

        const user = await User.findOne({ email: email })

        if (user) {
            return res.status(403).json({
                message: "Email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            username: username,
            email: email,
            password: hashedPassword
        })

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to create user",
            error: error.message
        })
    }
}

export const LoginUserController = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password"
            })
        }

        generateToken(res, user._id)

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        res.status(500).json({
            message: "Failed to login user",
            error: error.message
        })
    }
}

export const LogoutUserController = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
        })

        res.status(200).json({
            message: "User logged out successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to logout user",
            error: error.message
        })
    }
}

export const MeController = async (req, res) => {
    try {
        res.status(200).json({
            message: "User data retrieved successfully",
            user: {
                id : req.user._id,
                username : req.user.username,
                email : req.user.email,
                role : req.user.role
            }
        })
        
    } catch (error) {
        res.status(500).json({
            message: "Failed to get user data",
            error: error.message
        })
    }
}