const express=require("express");
const auth = require("../middleware/authMiddleware");
const { checkin, getCountCheckinThisMonth, getCheckinHistoryMember } = require("../controllers/checkinController");
const { getMyPackage } = require("../controllers/packageController");
const { route } = require("./testRoutes");
const { getCountServiceMember, getServiceByMember, getMyService, requestUseService, useIncludedService } = require("../controllers/serviceController");
const { getCountPT, getCountCompleteSessions, getMyTrainerPackage, getActivePTPackages } = require("../controllers/trainerPackageController");
const { getTodayScheduleMember, getBookingInfoController, bookTrainerSchedule, getMySchedule, cancelTrainerSchedule } = require("../controllers/scheduleController");
const { updateInfoMember, uploadVerifyPhoto } = require("../controllers/userController");
const router=express.Router();
const upload=require("../config/multer");
const { createRenewPayment } = require("../models/paymentModel");
const { createRenewPackagePayment } = require("../controllers/paymentController");


router.post("/checkin", auth, checkin);
router.get("/checkin/count", auth, getCountCheckinThisMonth);
router.get("/my-package", auth, getMyPackage);
router.get("/service/count", auth, getCountServiceMember);
router.get("/my-service", auth, getServiceByMember);
router.get("/my-services", auth, getMyService);
router.put("/service/:id/use", auth, requestUseService);
router.post("/services/included", auth, useIncludedService);
router.get("/my-trainer-package", auth, getMyTrainerPackage);

router.get("/schedule/booking/:id", auth, getBookingInfoController);
router.post("/schedule/book",auth, bookTrainerSchedule);
router.get("/schedule",auth, getMySchedule);
router.post("/schedule/:id/cancel", auth, cancelTrainerSchedule);

router.get("/trainer/active-packages",auth, getActivePTPackages);
router.get("/trainer/count", auth, getCountPT);
router.get("/trainer/completed-session", auth, getCountCompleteSessions);
router.get("/schedule/today", auth, getTodayScheduleMember);
router.get("/schedule/history", auth, getCheckinHistoryMember);

router.post("/verify-photo", auth, upload.single("photo"), uploadVerifyPhoto);

router.put("/health", auth, updateInfoMember);

;
module.exports=router;