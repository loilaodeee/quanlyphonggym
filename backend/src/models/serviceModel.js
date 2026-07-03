const db=require("../config/db");

const getAllServices=async()=>{
    const [rows]=await db.execute(
        "select * from services"
    );
    return rows;
}



const getCountServiceByMember=async (memberId)=>{
    const [rows]=await db.execute(
        "select count(*) as count from mem_services where member_id=?",[memberId]
    );
    return rows[0].count;
}

const getMemberService=async(memberId)=>{
    const [rows]=await db.execute(
        "select * from services s join mem_services ms on s.id=ms.service_id where ms.member_id=?", [memberId]
    );
    return rows;
}

const getIncludeService=async(memberId)=>{
    const [rows]=await db.execute(
        `select s.id, s.service_name, s.description, ps.benefit_text, ps.limit_type, ps.limit_value from members m join mem_packages mp on m.id=mp.member_id
         join package_services ps on ps.package_id=mp.package_id
         join services s on s.id=ps.service_id
         where m.id=? and mp.status='active'
        `, [memberId]
    );

    return rows;
}

const getPurchaseService=async (memberId)=>{
    const [rows]=await db.execute(
        `select ms.id AS member_service_id,
            ms.member_id,
            ms.service_id,
            ms.purchase_date,
            ms.request_use_time,
            ms.used_date,
            ms.status,

            s.id,
            s.service_name,
            s.description,
            s.price,
            s.unit,
            s.image from mem_services ms join services s on s.id=ms.service_id where ms.member_id=?
        
        `,[memberId]
    );
    return rows;
}

const updateServiceStatus=async (id)=>{
    const [result]=await db.execute(
        "update mem_services set status='using', request_use_time=NOW() where id=?",[id]
    );
    return result;
}

const getServiceById=async (id)=>{
    const [rows]=await db.execute(
        "select * from services where id=?",[id]
    );
    return rows[0];
}

const getMemberServiceHistory = async(memberId)=>{

    const [rows]=await db.execute(

        `SELECT
            ms.id,
            s.service_name,
            ps.service_id included_service,
            ms.used_date,
            ms.status,
            p.price,
            p.payment_method,
            p.created_at

        FROM mem_services ms

        JOIN services s
        ON s.id=ms.service_id

        LEFT JOIN payments p
        ON p.mem_service_id=ms.id

        LEFT JOIN mem_packages mp
        ON mp.member_id=ms.member_id
        AND mp.status='active'

        LEFT JOIN package_services ps
        ON ps.package_id=mp.package_id
        AND ps.service_id=ms.service_id

        WHERE ms.member_id=?

        ORDER BY p.created_at DESC;`,

        [memberId]

    );

    return rows;

}

const getEmployeeServicesModel = async (
    keyword = "",
    status = "all",
    limit,
    offset
) => {
    let sql=`SELECT
        ms.id,
        ms.request_use_time,
        ms.used_date,
        ms.status,
        p.price,
        s.service_name,
        m.member_code,
        a.fullname,
        m.verify_photo,

        CASE
            WHEN p.mem_service_id IS NULL THEN 1
            ELSE 0
        END AS included_service

    FROM mem_services ms

    JOIN members m
    ON m.id=ms.member_id

    JOIN accounts a
    ON a.id=m.account_id

    JOIN services s
    ON s.id=ms.service_id

    LEFT JOIN payments p
    ON p.mem_service_id=ms.id

    WHERE 1=1
    AND ms.status!='pending'`;

    const params=[];
    if(keyword){

        sql += `
        AND (
            a.fullname LIKE ?
            OR m.member_code LIKE ?
        )
        `;
    
        params.push(
            `%${keyword}%`,
            `%${keyword}%`
        );
    
    }
    if(status!=="all"){

        sql += ` AND ms.status=?`;
    
        params.push(status);
    
    }

    sql+=` order by ms.request_use_time desc limit ? offset ?`;
    params.push(limit);

    params.push(offset);

    let countSql=`

        SELECT COUNT(*) total

        FROM mem_services ms

        JOIN members m
        ON m.id=ms.member_id

        JOIN accounts a
        ON a.id=m.account_id

        JOIN services s
        ON s.id=ms.service_id

        WHERE 1=1
        AND ms.status!='pending'

        `;

    const countParams=[];

    if(keyword){
        countSql+=` and (a.fullname like ? or m.member_code like ?)`;

        countParams.push(`%${keyword}%`, `%${keyword}%`);
    }

    if(status!=="all"){
        countSql+=` and ms.status=?`;

        countParams.push(status)
    }

    const [rows]=await db.execute(sql, params);
    const [count]=await db.execute(countSql, countParams);

    return{
        services: rows,
        total: count[0].total
    }
}

const confirmService=async(serviceId)=>{
    const [result]=await db.execute(
        "update mem_services set status='used', used_date=NOW() where id=?", [serviceId]
    );
    return result;
}

const getPackageBenefit = async(
    memberId,
    serviceId
)=>{

    const [rows] = await db.execute(
        `SELECT
            ps.limit_type,
            ps.limit_value
        FROM mem_packages mp
        JOIN package_services ps
        ON ps.package_id = mp.package_id
        WHERE
            mp.member_id=?
        AND
            mp.status='active'
        AND
            ps.service_id=?
        `,
        [
            memberId,
            serviceId
        ]
    );

    return rows[0];

}

const countTodayService = async(
    memberId,
    serviceId
)=>{

    const [rows] = await db.execute(
        `SELECT
            COUNT(*) total
        FROM mem_services
        WHERE
            member_id=?
        AND
            service_id=?
        AND
            DATE(request_use_time)=CURDATE()
        `,
        [
            memberId,
            serviceId
        ]
    );
    return rows[0].total;
}

const createMemberService = async(
    memberId,
    serviceId
)=>{
    const [result] = await db.execute(
        `INSERT INTO mem_services(
            member_id,
            service_id,
            purchase_date,
            request_use_time,
            status
        )
        VALUES(
            ?,
            ?,
            NOW(),
            NOW(),
            'using'
        )
        `,
        [
            memberId,
            serviceId
        ]
    );
    return result.insertId;
}
module.exports={
    getAllServices,
    getCountServiceByMember,
    getMemberService,
    getIncludeService,
    getPurchaseService,
    updateServiceStatus,
    getServiceById,

    getMemberServiceHistory,
    getEmployeeServicesModel,
    confirmService,

    getPackageBenefit,
    countTodayService,
    createMemberService
};