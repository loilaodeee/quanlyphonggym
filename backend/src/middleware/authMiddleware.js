const jwt=require("jsonwebtoken");

const auth=(req, res, next)=>{
    const authHeader=req.headers.authorization;

    if(!authHeader){
        return res.status(404).json({
            message:"Chưa đăng nhập"
        })
    }
    const token=authHeader.split(" ")[1];
    try {
        const decode=jwt.verify(token, process.env.JWT_SECRET);
        req.user=decode;
        next();
    } catch {
        return res.status(404).json({
            message: "Token không hợp lệ"
        })
    }
}
module.exports=auth;