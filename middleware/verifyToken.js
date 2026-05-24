import jwt from "jsonwebtoken"
import User from "../models/User.js"


const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if(!token) {
            return res.status(401).json({
                message: "Unauthorized -- No token provided"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        const userId = decoded.userId
        const user = await User.findById(userId).select("-password")

        req.user = user
        next()


    } catch (error) {
        res.status(500).json({
            message: "Failed to verify token",
            error: error.message
        })
    }
}

export default verifyToken