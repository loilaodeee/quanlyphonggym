const db=require("../config/db");

const createCheckin=async (memberId)=>{
    const [result]=await db.execute(
        "insert into checkins(member_id, checkin_time) values(?,NOW())",[memberId]
    );
    return result.insertId;
}

const getHistoryCheckin=async(memberId)=>{
    const [rows]=await db.execute(
        "select * from checkins where member_id=? order by checkin_time desc",[memberId]
    );
    return rows;
}

const getCheckinThisMonth=async(memberId)=>{
    const [rows]=await db.execute(
        `select count(*) as count from checkins where member_id=? and MONTH(checkin_time)=MONTH(NOW())`+ 
        " and YEAR(checkin_time)=YEAR(NOW())",[memberId]
    );
    return rows[0].count;
    
}

const getCheckinHistory=async(memberId)=>{
    const [rows]=await db.execute(
        "select * from checkins order by checkin_time desc"
    );
    return rows;
}

const checkRecentCheckin=async (memberId)=>{
    const [rows]=await db.execute(
        "select * from checkins where member_id=? and checkin_time > date_sub(now(), interval 5 minute)",
        [memberId]
    );
    return rows.length>0;
}

const getRecentCheckins=async ()=>{
    const [rows]=await db.execute(
        `select c.id, c.checkin_time, a.fullname,
        m.member_code from checkins c join members m on c.member_id=m.id
        join accounts a on m.account_id=a.id order by c.checkin_time desc limit 5
        `
    );
    return rows;
}

const getMemberCheckinHistory = async(memberId)=>{
    const [rows]=await db.execute(
        `SELECT
            id,
            checkin_time
        FROM checkins
        WHERE member_id=?
        ORDER BY checkin_time DESC`,
        [memberId]
    );

    return rows;
}

module.exports={
    createCheckin,
    getHistoryCheckin,
    getCheckinThisMonth,
    getCheckinHistory,
    checkRecentCheckin,
    getRecentCheckins,
    getMemberCheckinHistory
}