import express from "express";
import 'dotenv/config'
import cookieParser from "cookie-parser";
import cors from 'cors';
import connectDB from "./config/db.js";

import authRoute from "./routes/authRoute.js";
import blogRoute from "./routes/blogRoute.js";
import commentRoute from "./routes/commentRoute.js";

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
    origin: 'https://deluxe-puffpuff-a23946.netlify.app',
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Routes
app.use('/api/auth', authRoute)
app.use('/api/blogs', blogRoute)
app.use('/api/blogs', commentRoute)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server Running in : http://localhost:${PORT}`)
    })
})

