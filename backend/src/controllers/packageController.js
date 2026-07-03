
const { findMemberByAccountId } = require("../models/memberModel");
const { refreshMemberPackageStatus } = require("../models/memberPackageModel");
const {getAllPackages, getPackageById, getMemberPackage}=require("../models/packageModel");

const getPackages=async (req, res)=>{
    const packages= await getAllPackages();

    res.json(packages); 
}

const getPackById=async (req, res)=>{
    const {id}=req.params;
    const pack=await getPackageById(id);
    if(!pack){
        res.status(404).json({
            message:"Không tìm thấy gói tập"
        })
    }
    res.json(pack);
}

const getMyPackage=async(req, res)=>{
    const member=await findMemberByAccountId(req.user.id);
    await refreshMemberPackageStatus(member.id);
    const memberPackage= await getMemberPackage(req.user.id);

    if(!memberPackage){
        return res.json(null)
    }
    res.json(memberPackage);
}
module.exports={
    getPackages,
    getPackById,
    getMyPackage
};

