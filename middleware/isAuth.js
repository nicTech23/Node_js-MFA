const isAuthorized = async(req, res, next)=>{

    if (!req.isAuthenticated()) {
        return res.status(401).json({message: "sns Unauthorized user"})
    }
    next()
}

export default isAuthorized;