const { findMemberByAccountId } = require("../models/memberModel");
const { getMyTrainerPackages, getActiveTrainerPackages } = require("../models/memberTrainerPackModel");
const { getCountPTActive, getCompletedSessions, getTrainerPackageById, getAllTrainerPack } = require("../models/trainerPackageModel");

const getCountPT=async(req, res)=>{
    const member=await findMemberByAccountId(req.user.id);
    const count =await getCountPTActive(member.id);

    res.json(count);
}

const getCountCompleteSessions=async(req, res)=>{
    const member=await findMemberByAccountId(req.user.id);
    const count=await getCompletedSessions(member.id);

    res.json(count);
}

const getTrainerPackages=async(req, res)=>{
    const trainerPackages=await getAllTrainerPack();
    res.json(trainerPackages);
}

const getTrainerPackById=async (req, res)=>{
    const {id}=req.params;
    const trainerPackage =await getTrainerPackageById(id);
    res.json(trainerPackage);
}

const getMyTrainerPackage =async (req, res)=>{
    const member=await findMemberByAccountId(req.user.id);
    const myTrainerPack=await getMyTrainerPackages(member.id);
    res.json(myTrainerPack);
}

const getActivePTPackages = async(req,res)=>{
    const member =
        await findMemberByAccountId(
            req.user.id
        );
    const packages =
        await getActiveTrainerPackages(
            member.id
        );

    res.json(packages);
}

module.exports={
    getCountPT,
    getCountCompleteSessions,
    getTrainerPackById,
    getTrainerPackages,
    getMyTrainerPackage,
    getActivePTPackages
}