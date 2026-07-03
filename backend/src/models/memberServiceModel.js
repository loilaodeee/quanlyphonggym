const db=require("../config/db");

const createMemberService =async (memberId, serviceId, connection=db)=>{
    const [result] =
        await connection.execute(
            `insert into mem_services
            (
                member_id,
                service_id,
                purchase_date,
                status
            )
            values
            (
                ?,
                ?,
                CURDATE(),
                'pending'
            )`,
            [memberId, serviceId]
        );

    return result.insertId;
}

module.exports={
    createMemberService
}