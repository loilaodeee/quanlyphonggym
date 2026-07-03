const {createUser, findUserByEmailOrMemCode, findUserById, checkEmail}=require("../models/userModel");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const register=async (req, res)=>{
    const {email, password, phone, fullname}=req.body;
    if(!email || !password|| !phone|| !fullname){
        return res.status(400).json({
            message:"Vui lòng nhập đầy đủ thông tin"
        })
    }
    const existEmail=await checkEmail(email);
    if(existEmail){
        return res.status(400).json({
            message: "Email đã tồn tại"
        });
    }

    const hashPass= await bcrypt.hash(password, 10)

    await createUser(email, hashPass, phone, fullname);
    res.json({
        message: "Đăng ký thành công"
    });
}

const login= async(req, res)=>{
    const {loginData, password}=req.body;
    if(!loginData|| !password){
        return res.status(404).json({
            message:"Vui lòng nhập đầy đủ thông tin"
        })
    }
    const user=await findUserByEmailOrMemCode(loginData);

    if(!user){
        return res.status(404).json({
            message:"Email hoặc Mã hội viên không tồn tại"
        })
    }
    const isMatch=await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(404).json({
            message: "Mật khẩu không chính xác"
        });
    }
    const token=jwt.sign({
            id: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"7d"
        }
    );
    const{password: _, 
        member_code,
        gender,
        birthday,
        address,
        height,
        weight,
        joined_date,
        verify_photo,
        ...accountData
    }=user

    const member=member_code?{
        member_code,
        gender,
        birthday,
        address,
        height,
        weight,
        joined_date,
        verify_photo,
    }: null;

    const userResponse={...accountData, member};

    res.status(200).json({
        message:"Đăng nhập thành công",
        token,
        user: userResponse
    })
}

const getProfile= async(req, res)=>{
    const user= await findUserById(req.user.id);

    const {
        password: _,
        id,
        member_code,
        gender,
        birthday,
        address,
        height,
        weight,
        joined_date,
        verify_photo,
        status,
        ...accountData
    } = user;

    const member =
        member_code
        ? {
            id,
            member_code,
            gender,
            birthday,
            address,
            height,
            weight,
            joined_date,
            verify_photo,
            status
        }
        :null;

    const userResponse = {
        ...accountData,
        member
    };
 
    res.json({
        user: userResponse
    });
}
module.exports={register, login, getProfile};