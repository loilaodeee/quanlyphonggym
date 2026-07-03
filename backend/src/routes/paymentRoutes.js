const express=require("express");
const auth = require("../middleware/authMiddleware");
const { createPackPayment, getPayment, webhookPay, createServicePayment, createTrainerPayment, createRenewPackagePayment } = require("../controllers/paymentController");
const router=express.Router();

router.post("/package", auth, createPackPayment);
router.post("/service", auth, createServicePayment);
router.post("/trainer", auth, createTrainerPayment);
router.get("/:id", auth, getPayment);
router.post("/webhook", webhookPay);

router.post("/renew-package/bank", auth, createRenewPackagePayment)
module.exports=router;