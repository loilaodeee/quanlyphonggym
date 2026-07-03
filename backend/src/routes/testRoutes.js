const express= require("express");
const router=express.Router();

router.get("/",(req, res)=>{
    res.json({
        message:"API GYM running"
    });
});

const {testDb}=require("../controllers/testController")

router.get("/db", testDb);
module.exports=router;
