const express=require("express");
const { dashboard, getSchedules, getMemberDetail, confirmTrainerSchedule, trainerMembers, profile, updateProfileInfo } = require("../../controllers/trainerController");
const auth = require("../../middleware/authMiddleware");
const router=express.Router();

router.get("/dashboard", auth, dashboard);
router.get("/schedules",auth, getSchedules);
router.get("/member/:id", auth, getMemberDetail);
router.post("/schedule/:id/complete", auth, confirmTrainerSchedule);
router.get("/members", auth, trainerMembers);
router.get("/profile", auth, profile);
router.put("/profile", auth, updateProfileInfo);

module.exports=router;