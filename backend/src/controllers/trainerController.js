const { getTrainerSchedules, getScheduleById, getMemTrainerPackById, completeSchedule, increaseUsedSession, completeTrainerPackage } = require("../models/scheduleModel");
const { getTrainerDashboard } = require("../models/trainerDashboardModel");
const { getAlltrainers, getTrainerById, findTrainerByAccountId, getTrainerMemberDetail, updateTrainerInfo } = require("../models/trainerModel");
const db=require("../config/db");
const { getTrainerMembers } = require("../models/memberTrainerPackModel");
const { getTrainerProfile } = require("../models/userModel");
const getTrainers=async(req, res)=>{
    const trainers=await getAlltrainers();

    res.json(trainers);
}

const getTrainerInfo=async(req, res)=>{
    const {id}=req.params;
    const trainer=await getTrainerById(id);

    res.json(trainer);
}

const dashboard=async(req,res)=>{
    const trainer=await findTrainerByAccountId(req.user.id);
    const data=
        await getTrainerDashboard(
            trainer.id
        );

    res.json(data);

}

const getSchedules = async(req,res)=>{
    const trainer =await findTrainerByAccountId(
            req.user.id
        );

    const {date="", status="all"} = req.query;

    const schedules =await getTrainerSchedules(
            trainer.id,
            date,
            status
        );

    res.json(schedules);

}

const getMemberDetail = async(req,res)=>{
    const data=await getTrainerMemberDetail(
            req.params.id
        );
    if(!data){
        return res.status(404).json({
            message:"Không tìm thấy hội viên"
        });
    }
    res.json(data);
}

const confirmTrainerSchedule = async(req,res)=>{
    let connection;
    try{
        connection=await db.getConnection();
        await connection.beginTransaction();
        const {id}=req.params;

        const schedule= await getScheduleById(id);

        if(!schedule){
            return res.status(404).json({
                message:"Không tìm thấy lịch"
            });
        }

        if(schedule.status!=="booked"){
            return res.status(400).json({
                message:"Buổi tập này đã xử lý"
            });
        }

        await completeSchedule(id, connection);

        await increaseUsedSession(
            schedule.mem_trainer_package_id,
            connection
        );

        const trainerPackage= await getMemTrainerPackById(
                schedule.mem_trainer_package_id
            );

        if(trainerPackage.used_sessions+1 >= trainerPackage.total_sessions){
            await completeTrainerPackage(
                trainerPackage.id,
                connection
            );

        }

        await connection.commit();

        res.json({
            message:"Đã xác nhận hoàn thành"
        });
    }

    catch(error){
        if(connection){
            await connection.rollback();
        }
        console.log(error);
        res.status(500).json({
            message:"Có lỗi xảy ra"
        });
    }
    finally{
        if(connection){
            connection.release();
        }
    }
}


const trainerMembers = async(req,res)=>{
    const trainer = await findTrainerByAccountId(
            req.user.id
        );

    const keyword = req.query.keyword || "";

    const status =req.query.status || "all";

    const data = await getTrainerMembers(
            trainer.id,
            keyword,
            status
        );

    res.json(data);
}


const profile = async (req,res)=>{
    const trainer =await getTrainerProfile(
            req.user.id
        );

    res.json(trainer);

}

const updateProfileInfo = async(req,res)=>{

    const{
        specialty,
        experience,
        description
    }=req.body;
    await updateTrainerInfo(
        req.user.id,
        specialty,
        experience,
        description
    );
    res.json({
        message:"Cập nhật thành công"
    });
}
module.exports={getTrainers,
    getTrainerInfo,
    dashboard,

    getSchedules,
    getMemberDetail,
    confirmTrainerSchedule,

    trainerMembers,
    profile,
    updateProfileInfo

};