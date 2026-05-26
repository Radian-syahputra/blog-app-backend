import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'none', // ✅ ganti dari 'strict' ke 'none'
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}

export default generateToken;
