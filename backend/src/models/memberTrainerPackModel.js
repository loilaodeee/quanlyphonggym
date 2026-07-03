const db=require("../config/db");

const createMemTrainerPackage=async(memberId, trainerId, trainerPackageId, sessions, connection=db)=>{
    const [result]=await connection.execute(
        `insert into mem_trainer_packages
        (member_id, trainer_id, trainer_package_id, total_sessions, used_sessions, purchase_date, status)
        values(?,?,?,?,0,CURDATE(),'active')
        
        `,[memberId, trainerId, trainerPackageId, sessions]
    );
    return result.insertId;
}

const getMyTrainerPackages=async(memberId)=>{
    const [rows]=await db.execute(
        `select mtp.*, a.fullname as trainer_name, a.avatar as trainer_avatar, t.specialty, tp.package_name,
        (
            mtp.total_sessions - mtp.used_sessions
        ) as remaining_sessions from members m join mem_trainer_packages mtp on m.id=mtp.member_id
         join trainer_packages tp on tp.id=mtp.trainer_package_id
         join trainers t on t.id=mtp.trainer_id
         join accounts a on a.id=t.account_id
          where m.id=?
        `,[memberId]
    );
    return rows;
}

const getActiveTrainerPackages = async(memberId)=>{
    const [rows] = await db.execute(
        `
        select
            mtp.*,

            a.fullname as trainer_name,
            a.avatar as trainer_avatar,

            t.specialty,

            tp.package_name,

            (
                mtp.total_sessions -
                mtp.used_sessions
            ) as remain

        from mem_trainer_packages mtp

        join trainers t
            on t.id = mtp.trainer_id

        join accounts a
            on a.id = t.account_id

        join trainer_packages tp
            on tp.id = mtp.trainer_package_id

        where mtp.member_id=?
        and mtp.status='active'
        `,
        [memberId]
    );

    return rows;
}

const getTrainerMembers = async (
    trainerId,
    keyword,
    status
) => {

    let sql = `
        SELECT
            m.id,
            m.member_code,
            a.fullname,
            a.phone,
            m.verify_photo,
            tp.package_name,
            mtp.used_sessions,
            mtp.total_sessions,
            mtp.status

        FROM mem_trainer_packages mtp

        JOIN members m
            ON m.id = mtp.member_id

        JOIN accounts a
            ON a.id = m.account_id

        JOIN trainer_packages tp
            ON tp.id = mtp.trainer_package_id

        WHERE mtp.trainer_id = ?
    `;
    const params = [trainerId];

    if(keyword){
        sql += `
            AND (
                a.fullname LIKE ?
                OR
                m.member_code LIKE ?
            )
        `;
        params.push(
            `%${keyword}%`,
            `%${keyword}%`
        );
    }

    if(status !== "all"){

        sql += `
            AND mtp.status = ?
        `;
        params.push(status);
    }

    sql += `
        ORDER BY a.fullname
    `;

    const [rows] = await db.execute(
        sql,
        params
    );

    return rows;
}

module.exports={
    createMemTrainerPackage,
    getMyTrainerPackages,
    getActiveTrainerPackages,

    getTrainerMembers
}