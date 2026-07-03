const express=require("express");
const router=express.Router();

const {getPackages, getPackById, getMyPackage}=require("../controllers/packageController");
const auth = require("../middleware/authMiddleware");

router.get("/", getPackages);
router.get("/:id", getPackById);


module.exports=router;
