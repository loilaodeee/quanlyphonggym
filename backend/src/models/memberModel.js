const db=require("../config/db");
const { refreshMemberPackageStatus } = require("./memberPackageModel");

const findMemberByAccountId=async(accountId, connection=db)=>{
    const [rows]=await connection.execute(
        "select * from members where account_id=?",[accountId]
    );
    return rows[0];
}

const createMember=async(accountId, memberCode, connection=db)=>{
    const [result]=await connection.execute(
        "insert into members(account_id, member_code, joined_date, status) values(?,?,NOW(),?)",
        [accountId, memberCode, 'active']
    );

    return result.insertId;
}

const updateMemberInfo=async (memberId, gender, birthday, height, weight, address)=>{
    const [result]=await db.execute(
        "update members set gender=?, birthday=?, height=?, weight=?, address=? where id=?",
        [gender, birthday, height, weight, address, memberId]
    );
    return result;
}

const findMemberByCode=async (memberCode)=>{
    const [rows]=await db.execute(
        `select m.*, a.fullname, a.avatar, a.phone from members m 
        join accounts a on a.id=m.account_id where m.member_code=?`,
        [memberCode]
    );
    return rows[0];
}

const updateVerifyPhoto=async(memberId, photo, connection=db)=>{
    const [result]=await connection.execute(
        `update members set verify_photo=? where id=?`,[photo, memberId]
    );
    return result;
}

const findMemberRenewInfo = async(memberCode)=>{
    const [memberRows]=await db.execute(
        "select * from members where member_code=?",[memberCode]
    );
    if(memberRows.length===0){
        return null;
    }
    await refreshMemberPackageStatus(memberRows[0].id);

    const [rows]=await db.execute(

        `select m.id, m.member_code, a.id as account_id,
            a.fullname, a.email, a.phone, m.verify_photo, gp.package_name,
            gp.id package_id, mp.end_date

        from members m

        join accounts a

            on a.id=m.account_id

        join mem_packages mp

            on mp.member_id=m.id

        join gym_packages gp

            on gp.id=mp.package_id

        where

            m.member_code=?

        and mp.status='active'

        limit 1`,

        [memberCode]

    );


    return rows[0];

}

const getAccountByMember=async(memberId, connection=db)=>{
    const [rows]=await connection.execute(
        "select * from members where id=?",[memberId]
    )
    return rows[0];
}

const getAllMembers = async (keyword="", status="all", limit, offset) => {
    let sql=`
        SELECT
            m.id,
            m.member_code,
            a.fullname,
            a.email,
            a.phone,
            m.status,
            mp.end_date,
            gp.package_name
        FROM members m

        JOIN accounts a
            ON a.id = m.account_id

        LEFT JOIN mem_packages mp
            ON mp.id = (
                SELECT id
                FROM mem_packages
                WHERE member_id = m.id
                AND status='active'
                LIMIT 1
            )

        LEFT JOIN gym_packages gp
            ON gp.id = mp.package_id
        where 1=1
        `;
    const params=[];
    if(keyword){
        sql+=` and a.fullname like ? or m.member_code like ?`;

        params.push(`%${keyword}%`, `%${keyword}%`);
    }

    if(status!=="all"){
        sql+=` and m.status=?`;

        params.push(status)
    }

    sql+=` order by m.id desc limit ? offset ?`;
    params.push(limit);

    params.push(offset);

    let countSql=`

    SELECT COUNT(*) total

    FROM members m

    JOIN accounts a
    ON a.id=m.account_id

    WHERE 1=1
    `;

    const countParams=[];

    if(keyword){
        countSql+=` (and a.fullname like ? or m.member_code like ?)`;

        countParams.push(`%${keyword}%`, `%${keyword}%`);
    }

    if(status!=="all"){
        countSql+=` and m.status=?`;

        countParams.push(status)
    }

    const [rows] = await db.execute(
        sql, params
    );

    const [count]=await db.execute(countSql, countParams);

    return {
        members: rows,
        total: count[0].total
    }

}

const getMemberDetailById=async (memberId)=>{
    const [rows]=await db.execute(
        `SELECT  m.id,
        m.member_code,
        m.gender,
        m.birthday,
        m.height,
        m.weight,
        m.address,
        m.joined_date,
        m.status,
        m.verify_photo,
        a.fullname,
        a.email,
        a.phone,
        gp.package_name,
        mp.start_date,
        mp.end_date

        FROM members m
        JOIN accounts a
        ON a.id=m.account_id

        LEFT JOIN mem_packages mp
        ON mp.id=(

        SELECT id
        FROM mem_packages
        WHERE member_id=m.id
        AND status='active'
        LIMIT 1
        )
        LEFT JOIN gym_packages gp
        ON gp.id=mp.package_id
        WHERE m.id=?`, [memberId]
    )
    return rows[0];
}

const updateMemberByEmployee=async(
    memberId,
    fullname,
    phone,
    gender,
    birthday,
    height,
    weight,
    address,
    verifyPhoto,
    connection=db
)=>{
    const [member]=await connection.execute(
        "select account_id from members where id=?",
        [memberId]
    );
    
    const accountId=member[0].account_id;

    await connection.execute(
        `update accounts
        set fullname=?,phone=?
        where id=?`,
        [
            fullname,
            phone,
            accountId
        ]
    );
    if(verifyPhoto){

        await connection.execute(
    
            `update members
            set
            gender=?,
            birthday=?,
            height=?,
            weight=?,
            address=?,
            verify_photo=?
            where id=?`,
    
            [
                gender,
                birthday,
                height,
                weight,
                address,
                verifyPhoto,
                memberId
            ]
    
        );
    
    }
    else{

        await connection.execute(
    
            `update members
            set
            gender=?,
            birthday=?,
            height=?,
            weight=?,
            address=?
            where id=?`,
    
            [
                gender,
                birthday,
                height,
                weight,
                address,
                memberId
            ]
    
        );
    
    }
}

module.exports={
    findMemberByAccountId,
    createMember,
    updateMemberInfo,
    findMemberByCode,
    updateVerifyPhoto,
    findMemberRenewInfo,
    getAccountByMember,
    getAllMembers,
    getMemberDetailById,

    updateMemberByEmployee
}