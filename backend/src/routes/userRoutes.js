const express=require("express");
const auth = require("../middleware/authMiddleware");
const { updateProfile, uploadAvatar } = require("../controllers/userController");
const router=express.Router();
const upload=require("../config/multer");

router.put("/profile", auth, updateProfile);
router.post("/avatar", auth, upload.single("avatar") ,uploadAvatar);
module.exports=router;