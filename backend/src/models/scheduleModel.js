const db=require("../config/db");
const getTodaySchedule=async (memberId)=>{
    const [rows]=await db.execute(
        `select ts.id,
        ts.schedule_date,
        ts.schedule_time,
        ts.status,
        a.fullname AS trainer_name,
        t.specialty from trainer_schedules ts join mem_trainer_packages mtp on mtp.id=ts.mem_trainer_package_id
         join trainers t on mtp.trainer_id=t.id join accounts a on a.id=t.account_id
          where mtp.member_id=? and ts.schedule_date=CURDATE() AND ts.status='booked'
         order by ts.schedule_time
        `, [memberId]
    );
    return rows;
}

const getBookingInfo = async(id)=>{
    const [rows]=await db.execute(
        `   select
            mtp.id as mem_trainer_package_id,

            a.fullname as trainer_name,
            a.avatar,

            t.specialty,

            (
                mtp.total_sessions - mtp.used_sessions -
                (
                    SELECT COUNT(*)
                    FROM trainer_schedules ts
                    WHERE ts.mem_trainer_package_id = mtp.id
                    AND ts.status='booked'
                )
            ) AS remain

        from mem_trainer_packages mtp

        join trainers t
            on t.id=mtp.trainer_id

        join accounts a
            on a.id=t.account_id

        where mtp.id=?
        `,
        [id]
    );

    return rows[0];
}

const createSchedule = async(
    memTrainerPackageId,
    scheduleDate,
    scheduleTime
)=>{
    const [result]=await db.execute(
        `
        insert into trainer_schedules(
            mem_trainer_package_id,
            schedule_date,
            schedule_time,
            status
        )
        values(
            ?,?,?,?
        )
        `,
        [
            memTrainerPackageId,
            scheduleDate,
            scheduleTime,
            "booked"
        ]
    );

    return result.insertId;
}

const getSchedulesByMember = async(memberId)=>{
    const [rows]=await db.execute(
        `
        select
            ts.*,
            a.fullname as trainer_name,
            t.specialty
        from trainer_schedules ts

        join mem_trainer_packages mtp
            on mtp.id=
            ts.mem_trainer_package_id

        join trainers t
            on t.id=
            mtp.trainer_id

        join accounts a
            on a.id=
            t.account_id

        where mtp.member_id=?

        order by
            ts.schedule_date desc,
            ts.schedule_time desc
        `,
        [memberId]
    );

    return rows;
}

const checkMemberScheduleDuplicate=async (memberId, scheduleDate, scheduleTime)=>{
    const [rows]=await db.execute(
        `select ts.id from trainer_schedules ts join mem_trainer_packages mtp on ts.mem_trainer_package_id=mtp.id
        where mtp.member_id=? and ts.schedule_date=? and ts.schedule_time=? and ts.status='booked'`,
        [memberId, scheduleDate, scheduleTime]
    );
    return rows.length>0;
}

const checkTrainerScheduleDuplicate=async (trainerId, scheduleDate, scheduleTime)=>{
    const [rows]=await db.execute(
        `select * from trainer_schedules ts join mem_trainer_packages mtp on mtp.id=ts.mem_trainer_package_id
        where mtp.trainer_id=? and ts.schedule_date=? and ts.schedule_time=? and ts.status='booked'
        `, [trainerId, scheduleDate, scheduleTime]
    );
    return rows.length>0;
}

const getMemTrainerPackById=async (id)=>{
    const [rows]=await db.execute(
        "select * from mem_trainer_packages where id=?",[id]
    );
    return rows[0];
}

const cancelSchedule=async (id)=>{
    const [result]=await db.execute(
        "update trainer_schedules set status='canceled' where id=?", [id]
    );
    return result;
}

const getScheduleById=async (id)=>{
    const [rows]=await db.execute(
        "select * from trainer_schedules where id=?", [id]
    );
    return rows[0];
}

const countBookedSchedule=async(memTrainerPackageId)=>{
    const [rows]=await db.execute(
        "select count(*) as total from trainer_schedules where mem_trainer_package_id=? and status='booked'", [memTrainerPackageId]
    );

    return rows[0].total;
}

const getTrainerSchedules = async (
    trainerId,
    date = "",
    status = "all"
) => {

    let sql = `
        SELECT
            ts.id,
            ts.schedule_date,
            ts.schedule_time,
            ts.status,
            m.id as member_id,
            m.member_code,
            a.fullname,
            a.phone,
            mtp.id AS mem_trainer_package_id
        FROM trainer_schedules ts

        JOIN mem_trainer_packages mtp
        ON mtp.id = ts.mem_trainer_package_id

        JOIN members m
        ON m.id = mtp.member_id

        JOIN accounts a
        ON a.id = m.account_id

        WHERE mtp.trainer_id = ?
    `;

    const params = [trainerId];

    if(date){
        sql += `
            AND ts.schedule_date = ?
        `;
        params.push(date);
    }

    if(status !== "all"){
        sql += `
            AND ts.status = ?
        `;
        params.push(status);
    }

    sql += `
    ORDER BY
        ts.schedule_date DESC,
        ts.schedule_time ASC
    `;

    const [rows] = await db.execute(sql, params);

    return rows;

};

const completeSchedule = async(id, connection)=>{
    await connection.execute(
        `
        UPDATE trainer_schedules
        SET status='completed'
        WHERE id=?
        `,
        [id]
    );
}

const increaseUsedSession = async(memTrainerPackageId, connection)=>{
    await connection.execute(
        `
        UPDATE mem_trainer_packages
        SET used_sessions=used_sessions+1
        WHERE id=?
        `,
        [memTrainerPackageId]
    );
}

const completeTrainerPackage = async(id, connection)=>{
    await connection.execute(
        `
        UPDATE mem_trainer_packages
        SET status='completed'
        WHERE id=?
        `,
        [id]
    );
}

module.exports={
    getTodaySchedule,
    getBookingInfo,
    createSchedule,
    getSchedulesByMember,
    checkMemberScheduleDuplicate,
    checkTrainerScheduleDuplicate,
    getMemTrainerPackById,
    cancelSchedule,
    getScheduleById,

    countBookedSchedule,

    getTrainerSchedules,
    completeSchedule,
    increaseUsedSession,
    completeTrainerPackage
}