const db=require("../config/db");

const getAlltrainers=async()=>{
    const [rows]=await db.execute(
        `select a.email, a.fullname, a.avatar, a.phone, t.* from accounts a join trainers t on a.id=t.account_id where a.status="active"`
    );

    return rows;
}

const getTrainerById=async(id)=>{
    const[rows]=await db.execute(
        "select t.*, a.fullname, a.avatar from trainers t join accounts a on t.account_id=a.id where t.id=?",[id]
    );
    return rows[0];
}

const findTrainerByAccountId=async(id)=>{
    const [rows]=await db.execute(
        "select * from trainers where account_id=?", [id]
    );
    return rows[0];
}

const getTrainerMemberDetail = async (memberId)=>{
    const [rows]=await db.execute(
        `
        SELECT

        m.id,
        m.member_code,

        a.fullname,
        a.email,
        a.phone,
        a.avatar,

        m.gender,
        m.birthday,
        m.height,
        m.weight,
        m.address,
        m.verify_photo,

        p.package_name,
        mp.end_date,

        tp.package_name trainer_package_name,

        mtp.total_sessions,
        mtp.used_sessions

        FROM members m

        JOIN accounts a
        ON a.id=m.account_id

        LEFT JOIN mem_packages mp
        ON mp.member_id=m.id
        AND mp.status='active'

        LEFT JOIN gym_packages p
        ON p.id=mp.package_id

        LEFT JOIN mem_trainer_packages mtp
        ON mtp.member_id=m.id
        AND mtp.status='active'

        LEFT JOIN trainer_packages tp
        ON tp.id=mtp.trainer_package_id

        WHERE m.id=?
        `,
        [memberId]
    );
    return rows[0];
}

const updateTrainerInfo = async(
    accountId,
    specialty,
    experience,
    description
)=>{
    await db.execute(
        `
        UPDATE trainers
        SET
            specialty=?,
            experience=?,
            description=?
        WHERE account_id=?
        `,
        [
            specialty,experience, description, accountId
        ]
    );
}
module.exports={getAlltrainers,
    getTrainerById,
    findTrainerByAccountId,
    getTrainerMemberDetail,
    updateTrainerInfo
};