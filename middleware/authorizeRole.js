

const authorizeRole = (role) => {
    return (req, res, next) => {
        const userRole = req.user.role

        if(userRole !== role) {
            return res.status(403).json({
                message: "Forbidden -- You don't have permission to access this resource"
            })
        }

        next()
    }

}

export default authorizeRole