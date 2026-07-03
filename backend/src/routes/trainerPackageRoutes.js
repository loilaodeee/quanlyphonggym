const express=require("express");
const { getTrainerPackById, getTrainerPackages } = require("../controllers/trainerPackageController");
const router=express.Router();

router.get("/", getTrainerPackages);
router.get("/:id", getTrainerPackById);

module.exports=router;