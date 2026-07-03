const db=require("../config/db");

const createPayment=async (accountId, packageId=null, trainerPackageId=null, serviceid=null, trainerId=null, price, paymentMethod, paymentType, connection=db)=>{
    const [result]=await connection.execute(
        "insert into payments(account_id, package_id, trainer_package_id, service_id, trainer_id, price, payment_method, payment_type, status, created_at) values(?,?,?,?,?,?,?,?,?,NOW())",
        [accountId, packageId, trainerPackageId, serviceid, trainerId, price, paymentMethod, paymentType, "pending"]
    );
    return result.insertId;
}

const createEmployeePayment=async (accountId=null, packageId=null, trainerPackageId=null, 
    serviceid=null, trainerId=null, price, fullname, email, phone, password, verifyPhoto)=>{

        const [result]=await db.execute(
            `insert into payments (account_id, package_id, trainer_package_id, service_id,
             trainer_id, price, payment_method, status, customer_fullname, customer_email, 
             customer_phone, customer_password, customer_verify_photo) values(?,?,?,?,?,?,'bank','pending',?,?,?,?,?)`,
             [accountId, packageId, trainerPackageId, serviceid, trainerId, price, 
                fullname, email, phone, password, verifyPhoto]
        );
        return result.insertId;
}

const createRenewPayment=async (accountId, packageId, price)=>{
    const [result]=await db.execute(
        "insert into payments(account_id, package_id, price, payment_method, payment_type, status, created_at) values(?,?,?,?,?,?,NOW())",
        [accountId, packageId, price, "bank", "renew_package", "pending"]
    );
    return result.insertId;
}

const getPaymentById=async (id)=>{
    const [rows]=await db.execute(
        "select * from payments where id=?",[id]
    );
    return rows[0];
}
const updateTranferContent=async(id, content)=>{
    const [result]=await db.execute(
        "update payments set transfer_content=? where id=?",[content, id]
    );
    return result;
}

const findPaymentByContent=async(content, connection=db)=>{
    const [row]=await connection.execute(
        "select * from payments where transfer_content=?",[content]
    );
    return row[0];
}

const updatePaymentStatus=async(id, connection=db)=>{
    const [result]=await connection.execute(
        "update payments set status='paid' where id=?",[id]
    );
    return result;
}


const updateMemberPackId=async(paymentId, memberPackageId, connection=db)=>{
    const [result]=await connection.execute(
        "update payments set mem_package_id=? where id=?", [memberPackageId, paymentId]
    );
    return result;
}
const updateMemberServiceId=async(paymentId, memberServiceId, connection=db)=>{
    const [result]=await connection.execute(
        "update payments set mem_service_id=? where id=?", [memberServiceId, paymentId]
    );
    return result;
}
const updateMemTrainerPackageId=async(paymentId, memTrainerPackageId, connection=db)=>{
    const [result]=await connection.execute(
        "update payments set mem_trainer_package_id=? where id=?", [memTrainerPackageId, paymentId]
    );
    return result;
}

const updateAccountId=async (paymentId, accountId, connection=db)=>{
    const [result]=await connection.execute(
        "update payments set account_id=? where id=?", [accountId, paymentId]
    )
    return result;
}

const getEmployeePaymentSuccess=async (id)=>{
    const [rows]=await db.execute(
        `SELECT
            p.price,
            a.fullname,
            a.email,
            a.phone,
            m.member_code,
            pk.package_name,
            mp.start_date,
            mp.end_date
        FROM payments p
        JOIN accounts a
            ON a.id=p.account_id
        JOIN members m
            ON m.account_id=a.id
        JOIN mem_packages mp
            ON mp.id=p.mem_package_id
        JOIN gym_packages pk
            ON pk.id=mp.package_id
        WHERE p.id=?`,[id]
    );
    return rows[0];
}

const getPackageSellHistory=async (keyword="", paymentMethod="all")=>{
    let sql=`SELECT
            p.id,
            a.fullname,
            gp.package_name,
            p.payment_method,
            p.price,
            p.created_at
        FROM payments p
        JOIN accounts a
            ON a.id = p.account_id
        JOIN gym_packages gp
            ON gp.id = p.package_id where 1=1
`
    const params=[];
    if(keyword){
        sql+=` and a.fullname like ?`;

        params.push(`%${keyword}%`);

    }

    if(paymentMethod!=="all"){
        sql+=` and p.payment_method=?`;
        params.push(paymentMethod);
    }

    sql+=` order by p.created_at desc limit 20`;

    const [rows]=await db.execute(sql, params);
    return rows;
}

const getMemberPackageHistory = async(accountId)=>{
    const [rows] = await db.execute(
        `SELECT
            p.id,
            p.payment_type,
            p.payment_method,
            p.price,
            p.created_at,
            gp.package_name
        FROM payments p

        JOIN gym_packages gp
            ON gp.id = p.package_id

        WHERE
            p.account_id = ?
        AND
            p.payment_type IN ('buy_package','renew_package')
        AND
            p.status='paid'

        ORDER BY p.created_at DESC`,
        [accountId]
    );

    return rows;
}
module.exports={
    createPayment,
    getPaymentById,
    updateTranferContent,
    findPaymentByContent,
    updatePaymentStatus,
    updateMemberPackId,
    updateMemberServiceId,
    updateMemTrainerPackageId,
    createEmployeePayment,
    updateAccountId,
    getEmployeePaymentSuccess,
    getPackageSellHistory,
    createRenewPayment,

    getMemberPackageHistory
}