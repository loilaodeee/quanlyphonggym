const multer=require("multer");
const path=require("path");

const storage=multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, "uploads/avatars");
    },
    filename: (req, file, cb)=>{
        const ext=path.extname(file.originalname);
        cb(null, Date.now() +ext);
    }
});

module.exports=multer({storage})