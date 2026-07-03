const express=require("express");
const { getMemberByCode, checkInMember, getRecentCheckinsController } = require("../controllers/checkinController");
const auth=require("../middleware/authMiddleware");
const {sellPackage, getPackages, createPackageQr, getEmploySuccess, getSellHistory, getRenewMember, renewPackage, createRenewPackageQr, getMembers, getMemberDetail, getMemberHistory, getMemberCheckin, getMemberServiceHistoryController, getMemberTrainerHistoryController, updateMember, getEmployeeServices, confirmServiceEmployee, dashboard, pendingServices, getProfile}=require("../controllers/employeeController")
const upload=require("../config/multer");
const { uploadAvatar, updateProfile } = require("../controllers/userController");
const router=express.Router();

router.get("/member/:memberCode",auth, getMemberByCode);
router.post("/checkin",auth, checkInMember);

router.get("/members", auth, getMembers);
router.get("/members/:id", auth, getMemberDetail);
router.get("/members/:id/history", auth, getMemberHistory);
router.get("/members/:id/checkins", auth, getMemberCheckin);
router.get("/members/:id/services", auth, getMemberServiceHistoryController);
router.get("/members/:id/trainers", auth, getMemberTrainerHistoryController);
router.put("/members/:id", auth, upload.single("verifyPhoto"), updateMember);

router.get("/services", auth, getEmployeeServices);
router.post("/services/:serviceId/confirm", auth, confirmServiceEmployee);

router.get("/dashboard", auth, dashboard);
router.get("/pending-services",auth,pendingServices);
router.get("/recent-checkins",auth, getRecentCheckinsController);

router.get("/profile", auth, getProfile);
router.put("/profile",auth,updateProfile);
router.post("/avatar",auth, upload.single("avatar"), uploadAvatar);

router.post("/sell-package/cash", auth,upload.single("photo"), sellPackage);
router.get("/packages", auth, getPackages); 
router.post("/sell-package/bank", auth, upload.single("photo"), createPackageQr);
router.get("/payment-success/:paymentId", auth, getEmploySuccess);

router.get("/sell-package/history", auth, getSellHistory);
router.get("/renew-package/:memberCode", auth, getRenewMember);
router.post("/renew-package/cash", auth, renewPackage);
router.post("/renew-package/bank", auth, createRenewPackageQr);

module.exports=router;