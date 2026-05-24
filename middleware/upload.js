import multer from "multer";
import cloudinary from "../config/cloudinary.js";


const storage = multer.memoryStorage()

const upload = multer({ storage: storage })

// Untuk thumbnail (Buffer dari req.file)
const uploadBufferToCloudinary = (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: folder },
            (error, result) => {
                if (error) reject(error)
                else resolve(result.secure_url)
            }
        ).end(fileBuffer)
    })
}

// Untuk content image (base64 string)
const uploadBase64ToCloudinary = (base64String, folder) => {
    return new Promise((resolve, reject) => {
        // Hapus prefix data:image/jpeg;base64, kalau ada
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '')
        
        // Konversi base64 string ke buffer
        const buffer = Buffer.from(base64Data, 'base64')
        
        // Upload pakai upload_stream seperti thumbnail
        cloudinary.uploader.upload_stream(
            { folder: folder },
            (error, result) => {
                if (error) reject(error)
                else resolve(result.secure_url)
            }
        ).end(buffer)
    })
}

export { upload, uploadBufferToCloudinary, uploadBase64ToCloudinary }