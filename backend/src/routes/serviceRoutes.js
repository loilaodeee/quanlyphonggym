const express= require("express");
const { getServices, getInfoServiceById } = require("../controllers/serviceController");
const auth = require("../middleware/authMiddleware");
const router=express.Router();

router.get("/", getServices);
router.get("/:id", getInfoServiceById);

module.exports=router;