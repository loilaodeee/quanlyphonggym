
const express=require("express");
const { getTrainers, getTrainerInfo } = require("../controllers/trainerController");

const router=express.Router();

router.get("/", getTrainers);
router.get("/:id", getTrainerInfo);


module.exports=router;