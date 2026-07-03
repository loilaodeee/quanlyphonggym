const db= require("../config/db");
const { refreshMemberPackageStatus, getActivePackage, getWaitingPackage, getPackageHistory } = require("./memberPackageModel");

const getAllPackages=async ()=>{
    const [rows]= await db.execute(
        "select * from gym_packages"
    );
    return rows;
}

const getPackageById=async(id, connection=db)=>{
    const [rows]=await connection.execute(
        "select * from gym_packages where id=?",[id]
    );

    return rows[0];
}

const getMemberPackage = async(accountId)=>{
    const [memberRows] = await db.execute(
        "SELECT * FROM members WHERE account_id=?",
        [accountId]
    );

    if(memberRows.length===0){
        return null;
    }

    const memberId = memberRows[0].id;

    await refreshMemberPackageStatus(memberId);

    const activePackage = await getActivePackage(accountId);

    const waitingPackage = await getWaitingPackage(accountId);

    const history = await getPackageHistory(accountId);

    // tính số ngày còn lại
    if(activePackage){

        const today = new Date();

        const endDate = new Date(activePackage.end_date);

        activePackage.remaining_days =
            Math.max(
                0,
                Math.ceil(
                    (endDate - today) /
                    (1000*60*60*24)
                )
            );

        activePackage.start_date =
            activePackage.start_date
                .toISOString()
                .split("T")[0];

        activePackage.end_date =
            endDate
                .toISOString()
                .split("T")[0];
    }

    if(waitingPackage){

        const today = new Date();
    
        const startDate = new Date(waitingPackage.start_date);
    
        waitingPackage.waiting_days =
            Math.max(
                0,
                Math.ceil(
                    (startDate - today) /
                    (1000 * 60 * 60 * 24)
                )
            );
    
        waitingPackage.start_date =
            waitingPackage.start_date
                .toISOString()
                .split("T")[0];
    
        waitingPackage.end_date =
            new Date(waitingPackage.end_date)
                .toISOString()
                .split("T")[0];
    
    }

    return {

        activePackage,

        waitingPackage,

        history

    };

}
module.exports={
    getAllPackages,
    getPackageById,
    getMemberPackage
};