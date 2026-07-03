const db=require("../config/db");

const testDb=async (req, res)=>{
    const [row]= await db.execute(
        "select NOW() as currentTime"
    );

    res.json(row);
}

module.exports={
    testDb
};