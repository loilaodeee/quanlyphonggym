const db=require("../config/db");

const getCountPTActive=async(memberId)=>{
    const [rows]=await db.execute(
        "select count(*) as count from mem_trainer_packages where member_id=? and status='active'",[memberId]
    );
    return rows[0].count;
}

const getCompletedSessions=async (memberId)=>{
    const [rows]=await db.execute(
        "select sum(used_sessions) as total from mem_trainer_packages where member_id=?",[memberId]
    );
    return rows[0].total;
}

const getAllTrainerPack=async ()=>{
    const [rows]=await db.execute(
        "select * from trainer_packages"
    );
    return rows;
}

const getTrainerPackageById=async (id, connection=db)=>{
    const [rows]=await connection.execute(
        "select * from trainer_packages where id=?",[id]
    );
    return rows[0];
}

const getMemberTrainerHistory=async(memberId)=>{

    const [rows]=await db.execute(

        `SELECT
            mtp.id,
            tp.package_name,
            a.fullname trainer_name,
            mtp.total_sessions,
            mtp.used_sessions,
            mtp.status,
            p.price,
            p.payment_method,
            p.created_at

        FROM mem_trainer_packages mtp

        JOIN trainer_packages tp
            ON tp.id=mtp.trainer_package_id

        JOIN trainers t
            ON t.id=mtp.trainer_id
        join accounts a on a.id=t.account_id

        LEFT JOIN payments p
            ON p.mem_trainer_package_id=mtp.id

        WHERE mtp.member_id=?

        ORDER BY p.created_at DESC`,

        [memberId]

    );

    return rows;

}

module.exports={
    getCountPTActive,
    getCompletedSessions,
    getTrainerPackageById,
    getAllTrainerPack,

    getMemberTrainerHistory
}