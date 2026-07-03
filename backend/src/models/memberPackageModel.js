const db=require("../config/db");

const createMemberPackage=async (memberId, packageId, startDate, endDate, status, connection=db)=>{
    const [result]=await connection.execute(
        "insert into mem_packages(member_id, package_id, start_date, end_date, status) values(?,?,?,?,?)",
        [memberId, packageId, startDate, endDate, status]
    );
    return result.insertId;
}

const getCurrentPackage = async(memberId, connection=db)=>{

    const [rows]=await connection.execute(
        `SELECT *
        FROM mem_packages
        WHERE member_id=?
        AND status='active'
        LIMIT 1`,
        [memberId]
    );
    return rows[0];

}

const refreshMemberPackageStatus = async (
    memberId,
    connection = db
) => {

    await connection.execute(
        `
        UPDATE mem_packages
        SET status='expired'
        WHERE member_id=?
        AND status='active'
        AND end_date < CURDATE()
        `,
        [memberId]
    );

    await connection.execute(
        `
        UPDATE mem_packages
        SET status='active'
        WHERE member_id=?
        AND start_date<=CURDATE()
        AND end_date>=CURDATE()
        AND status='waiting'
        `,
        [memberId]
    );

    const currenPackage=await getCurrentPackage(memberId);
    if(currenPackage){
        connection.execute(
            "update members set status='active' where id=?",[memberId]
        )
    }
    else{
        connection.execute(
            "update members set status='inactive' where id=?", [memberId]
        )
    }

};

const extendMemberPackage = async (
    memberPackageId,
    endDate,
    connection = db
)=>{
    const [result] = await connection.execute(
        `
        UPDATE mem_packages
        SET end_date=?
        WHERE id=?
        `,
        [endDate, memberPackageId]
    );

    return result;
}

const getActivePackage = async(accountId)=>{

    const [rows] = await db.execute(

        `SELECT
            mp.*,
            gp.package_name,
            gp.price,
            gp.description

        FROM members m

        JOIN mem_packages mp
            ON mp.member_id=m.id

        JOIN gym_packages gp
            ON gp.id=mp.package_id

        WHERE
            m.account_id=?
        AND mp.status='active'

        LIMIT 1`,

        [accountId]

    );

    return rows[0] || null;

}

const getWaitingPackage = async(accountId)=>{

    const [rows]=await db.execute(

        `SELECT
            mp.*,
            gp.package_name,
            gp.price,
            gp.description

        FROM members m

        JOIN mem_packages mp
            ON mp.member_id=m.id

        JOIN gym_packages gp
            ON gp.id=mp.package_id

        WHERE
            m.account_id=?
        AND mp.status='waiting'

        ORDER BY mp.start_date desc

        LIMIT 1`,

        [accountId]

    );

    return rows[0] || null;

}

const getPackageHistory = async(accountId)=>{

    const [rows]=await db.execute(

        `SELECT
            mp.*,
            gp.package_name

        FROM members m

        JOIN mem_packages mp
            ON mp.member_id=m.id

        JOIN gym_packages gp
            ON gp.id=mp.package_id

        WHERE
            m.account_id=?

        ORDER BY
            mp.start_date DESC`,

        [accountId]

    );

    return rows;

}
module.exports={
    createMemberPackage,
    getCurrentPackage,
    refreshMemberPackageStatus,
    extendMemberPackage,
    getActivePackage,
    getWaitingPackage,
    getPackageHistory
}