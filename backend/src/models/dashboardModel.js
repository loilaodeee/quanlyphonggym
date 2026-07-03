const db=require("../config/db");

const getEmployeeDashboard=async()=>{

    const [members]=await db.execute(
        "SELECT COUNT(*) total FROM members WHERE status='active'"
    );

    const [checkins]=await db.execute(
        "SELECT COUNT(*) total FROM checkins WHERE DATE(checkin_time)=CURDATE()"
    );

    const [services]=await db.execute(
        "SELECT COUNT(*) total FROM mem_services WHERE status='using'"
    );

    const [revenue]=await db.execute(
        `SELECT IFNULL(SUM(price),0) total
        FROM payments
        WHERE status='paid'
        AND DATE(created_at)=CURDATE()`
    );

    return{

        totalMembers:members[0].total,

        todayCheckins:checkins[0].total,

        pendingServices:services[0].total,

        todayRevenue:revenue[0].total

    };

}

const getPendingServices=async()=>{

    const [rows]=await db.execute(

        `SELECT

            ms.id,

            m.member_code,

            a.fullname,

            s.service_name,

            ms.request_use_time

        FROM mem_services ms

        JOIN members m
        ON m.id=ms.member_id

        JOIN accounts a
        ON a.id=m.account_id

        JOIN services s
        ON s.id=ms.service_id

        WHERE ms.status='using'

        ORDER BY ms.request_use_time DESC

        LIMIT 5`

    );

    return rows;

}

module.exports={
    getEmployeeDashboard,
    getPendingServices
};