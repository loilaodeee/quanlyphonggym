const db=require("../config/db");


const createUser= async(email, password, phone, fullname, connection=db)=>{
    const [result]= await connection.execute(
        `insert into accounts(email, password, phone, fullname, role_id) values(?,?,?,?,?)`,[email, password, phone, fullname,"4"]
    );
    return result.insertId;
}

const findUserByEmailOrMemCode= async(loginData)=>{
    const [rows]=await db.execute(
        `select a.*, m.member_code, m.gender, m.birthday, m.address, m.height, m.weight, m.joined_date, m.verify_photo from accounts a left join members m on a.id=m.account_id  where email=? or m.member_code=?`,
        [loginData, loginData]
    )
    return rows[0];
}

const findUserById=async (id)=>{
    const [rows]= await db.execute(
        "select a.*, m.member_code, m.gender, m.birthday, m.address, m.height, m.weight, m.joined_date, m.verify_photo from accounts a left join members m on a.id=m.account_id where a.id=?",
        [id]
    )
    return rows[0];
}

const checkEmail=async (email, connection=db)=>{
    const [rows]=await connection.execute(
        "select * from accounts where email=?",[email]
    );
    return rows[0];
}

const updateUser=async (id, fullname, phone)=>{
    const [result]=await db.execute(
        "update accounts set fullname=? , phone=? where id=?",[fullname, phone, id]
    );
    return result;
}

const updateAvatar=async (id, avatar)=>{
    const [results]=await db.execute(
        "update accounts set avatar=? where id=?", [avatar, id]
    );
    return results;
}

const getEmployeeProfile = async (accountId) => {

    const [rows] = await db.execute(

        `SELECT
            id,
            fullname,
            email,
            phone,
            avatar,
            role_id,
            status
        FROM accounts
        WHERE id=?`,

        [accountId]

    );

    return rows[0];

};

const getTrainerProfile = async (accountId) => {
    const [rows] = await db.execute(
        `
        SELECT
            a.id,
            a.fullname,
            a.email,
            a.phone,
            a.avatar,

            t.id trainer_id,
            t.specialty,
            t.experience,
            t.description,
            t.is_featured

        FROM accounts a

        JOIN trainers t
            ON a.id=t.account_id

        WHERE a.id=?
        `,
        [accountId]
    );

    return rows[0];
}

module.exports={createUser, findUserByEmailOrMemCode, findUserById, checkEmail, updateUser,
    updateAvatar, getEmployeeProfile, getTrainerProfile

};