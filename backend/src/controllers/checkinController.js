const { createCheckin, getCheckinThisMonth, getCheckinHistory, checkRecentCheckin, getRecentCheckins, getHistoryCheckin } = require("../models/checkinModel");
const { findMemberByAccountId, findMemberByCode } = require("../models/memberModel");
const { refreshMemberPackageStatus } = require("../models/memberPackageModel");

const checkin=async (req, res)=>{
    let member=await findMemberByAccountId(req.user.id);
    await refreshMemberPackageStatus(member.id);
    member=await findMemberByAccountId(req.user.id);
    if(member.status !== 'active'){
        return res.status(400).json({
            message:"Bạn cần có gói tập đang hoạt động"
        })
    }
    
    await createCheckin(member.id);

    res.json({
        message: "Check-in thành công"
    })
}

const getCountCheckinThisMonth=async(req, res)=>{
    const member=await findMemberByAccountId(req.user.id);
    const count=await getCheckinThisMonth(member.id);

    res.json(count);
}

const getCheckinHistoryMember=async(req, res)=>{
    const member=await findMemberByAccountId(req.user.id);
    const checkinHistory= await getHistoryCheckin(member.id);
    res.json(checkinHistory);
}

const getMemberByCode=async (req,res)=>{
    const {memberCode}=req.params;
    const member=await findMemberByCode(memberCode);

    if(!member){
        return res.status(404).json({
            message:"Không tìm thấy hội viên"
        })
    }

    res.json(member);
}
const checkInMember=async (req, res)=>{
    const {memberId, memberCode}=req.body;

    const recent=await checkRecentCheckin(memberId);
    if(recent){
        return res.status(404).json({
            message:"Hội viên vừa checkin gần đây"
        })
    }
    let member = await findMemberByCode(memberCode);

    await refreshMemberPackageStatus(member.id);

    member = await findMemberByCode(memberCode);

    if(member.status !== "active"){
        return res.status(400).json({
            message:"Gói tập đã hết hạn."
        });
    }
    await createCheckin(memberId);

    res.json({
        message:"Check-in thành công"
    })
}

const getRecentCheckinsController=async(req, res)=>{
    const recentCheckin=await getRecentCheckins();

    res.json(recentCheckin);
}


module.exports={
    checkin,
    getCountCheckinThisMonth,
    getCheckinHistoryMember,
    getMemberByCode,
    checkInMember,
    getRecentCheckinsController
}