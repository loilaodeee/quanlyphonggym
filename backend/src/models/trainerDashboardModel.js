const db=require("../config/db");

const getTrainerDashboard=async(trainerId)=>{

    const [today]=await db.execute(
        `
        SELECT COUNT(*) total
        FROM trainer_schedules ts
        join mem_trainer_packages mtp on mtp.id=ts.mem_trainer_package_id
        WHERE mtp.trainer_id=?
        AND DATE(ts.schedule_date)=CURDATE()
        AND ts.status IN ('booked','completed')
        `,
        [trainerId]
        );

    const [completed]=await db.execute(
        `
        SELECT COUNT(*) total
        FROM trainer_schedules ts
        join mem_trainer_packages mtp on mtp.id=ts.mem_trainer_package_id
        WHERE mtp.trainer_id=?
        AND DATE(ts.schedule_date)=CURDATE()
        AND ts.status='completed'
        `,
        [trainerId]
        );
    
    const [booked] = await db.execute(
        `
        SELECT COUNT(*) total
        FROM trainer_schedules ts
    
        JOIN mem_trainer_packages mtp
        ON mtp.id = ts.mem_trainer_package_id
    
        WHERE mtp.trainer_id = ?
    
        AND DATE(ts.schedule_date) = CURDATE()
    
        AND ts.status = 'booked'
        `,
        [trainerId]
    );

    const [members]=await db.execute(
        `
        SELECT COUNT(DISTINCT member_id) total

        FROM mem_trainer_packages

        WHERE trainer_id=?

        AND status='active'
        `,
        [trainerId]
        );
    
    const [schedules]=await db.execute(
        `
        SELECT
        ts.id,
        ts.schedule_time,
        ts.status,
        a.fullname,
        m.member_code
        
        FROM trainer_schedules ts
        join mem_trainer_packages mtp on mtp.id=ts.mem_trainer_package_id


        JOIN members m
        ON m.id=mtp.member_id
        
        JOIN accounts a
        ON a.id=m.account_id
        
        
        WHERE mtp.trainer_id=?
        
        AND DATE(ts.schedule_date)=CURDATE()
        and ts.status in ('booked','completed')
        
        ORDER BY ts.schedule_time
        `,
        [trainerId]
        );
    
    return{

        todaySchedules: today[0].total,
    
        completedSchedules: completed[0].total,
        bookedSchedules: booked[0].total,
    
        activeMembers: members[0].total,
    
        schedules
    
    }
}

module.exports={
    getTrainerDashboard
}