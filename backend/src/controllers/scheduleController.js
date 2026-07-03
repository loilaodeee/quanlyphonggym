const { listeners } = require("../config/db");
const { findMemberByAccountId } = require("../models/memberModel");
const { refreshMemberPackageStatus } = require("../models/memberPackageModel");
const { getTodaySchedule, getSchedulesByMember, createSchedule, getBookingInfo, getMemTrainerPackById, checkMemberScheduleDuplicate, checkTrainerScheduleDuplicate, getScheduleById, cancelSchedule, countBookedSchedule } = require("../models/scheduleModel");

const getTodayScheduleMember=async(req, res)=>{
    const member=await findMemberByAccountId(req.user.id);

    const schedule=await getTodaySchedule(member.id);
    res.json(schedule);
}

const getBookingInfoController = async(req,res)=>{

    const {id}=req.params;

    const data=
        await getBookingInfo(id);

    res.json(data);
}

const bookTrainerSchedule = async(req,res)=>{
    const {
        mem_trainer_package_id,
        schedule_date,
        schedule_time
    }=req.body;

    let member=await findMemberByAccountId(req.user.id);

    await refreshMemberPackageStatus(member.id);

    member=await findMemberByAccountId(req.user.id);
    if(member.status !== 'active'){
        return res.status(400).json({
            message:"Bạn cần có gói tập đang hoạt động"
        })
    }

    const memTrainerPack=await getMemTrainerPackById(mem_trainer_package_id);

    if(memTrainerPack.member_id !== member.id){
        return res.status(400).json({
            message:"Không có quyền sử dụng gói PT này"
        });
    }
    const booked=await countBookedSchedule(memTrainerPack.id);
    const remain=memTrainerPack.total_sessions - memTrainerPack.used_sessions - booked;

    if(remain<=0){
        return res.status(400).json({
            message:"Bạn đã sử dụng hết số buổi của gói PT"
        })
    }

    if(memTrainerPack.status!=="active"){
        return res.status(400).json({
            message: "Gói PT đã hết hiệu lực"
        })
    }
    
    const memberScheduleDuplicate=await checkMemberScheduleDuplicate(member.id, schedule_date, schedule_time);
    if(memberScheduleDuplicate){
        return res.status(400).json({
            message:"Bạn đã có lịch tập ở khung giờ này rồi"
        })
    }
    const trainerScheduleDuplicate=await checkTrainerScheduleDuplicate(memTrainerPack.trainer_id, schedule_date, schedule_time);
    if(trainerScheduleDuplicate){
        return res.status(400).json({
            message:"PT đã có lịch ở khung giờ này. Bạn hãy đặt khung giờ khác"
        });
    }

    await createSchedule(
        mem_trainer_package_id,
        schedule_date,
        schedule_time
    );

    res.json({
        success:true
    });
}
const getMySchedule = async(req,res)=>{

    const member=
        await findMemberByAccountId(
            req.user.id
        );

    const schedules=
        await getSchedulesByMember(
            member.id
        );

    res.json(schedules);
}

const cancelTrainerSchedule=async (req, res)=>{
    const {id}=req.params;
    const schedule=await getScheduleById(id);

    if(!schedule){
        return res.status(404).json({
            message:"Không tìm thấy lịch"
        })
    }

    if(schedule.status!=="booked"){
        return res.status(404).json({
            message:"Không thể hủy lịch này"
        })
    };

    const scheduleTime=new Date(`${schedule.schedule_date} ${schedule.schedule_time}`);
    const now= new Date();
    const diff= (scheduleTime-now)/(1000*60*60);

    if(diff<2){
        return res.status(404).json({
            message:"Chỉ được hủy lịch trước 2 tiếng"
        })
    }
    await cancelSchedule(id);

    res.json({
        message:"Hủy lịch thành công"
    });
}
module.exports={
    getTodayScheduleMember,
    getBookingInfoController,
    bookTrainerSchedule,
    getMySchedule,
    cancelTrainerSchedule
}