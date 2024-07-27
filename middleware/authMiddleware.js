const jwt = require("jsonwebtoken")

const requireAuth = (req,res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if(token){
        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
            if(err){
                console.log(err.message);
                return res.status(400).json({success: false, message: "Unauthorirized"});
            }else{
                req.user = decodedToken;
                next();
            }
        });
    }else{
        return res.status(400).json({ success: false, message:"Unauthorized" })
    }
}

module.exports = (requireAuth)