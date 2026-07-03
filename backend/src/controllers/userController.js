const { findMemberByAccountId, updateMemberInfo, updateVerifyPhoto } = require("../models/memberModel");
const { updateUser, updateAvatar } = require("../models/userModel");


const updateProfile=async(req, res)=>{
    const {fullname, phone, avatar}=req.body;

    await updateUser(req.user.id, fullname, phone, avatar);
    res.json({
        message:"Cập nhật thông tin thành công"
    })
}

const uploadAvatar=async (req, res)=>{
    const avatarPath=`/uploads/avatars/${req.file.filename}`;
    await updateAvatar(req.user.id, avatarPath);
    res.json({
        message: "Cập nhật avatar thành công",
        avatar: avatarPath
    })
}

const updateInfoMember=async(req, res)=>{
    const {gender, birthday, height, weight, address}=req.body;
    const member=await findMemberByAccountId(req.user.id);
    if(!member){
        return res.status(404).json({
            message:"Không phải hội viên"
        })
    }
    await updateMemberInfo(member.id, gender, birthday, height, weight, address);
    res.json({
        message:"Cập nhật thông tin sức khỏe hội viên thành công"
    })
}

const uploadVerifyPhoto=async(req, res)=>{
    if(!req.file){
        return res.status(400).json({
            message:"Vui lòng chọn ảnh"
        });
    }
    const verifyPath=`/uploads/avatars/`+req.file.filename;
    const member=await findMemberByAccountId(req.user.id);
    if(member.verify_photo){
        return res.status(400).json({
            message:"Hội viên đã có ảnh xác minh rồi. Muốn đổi ảnh xác minh hãy liên hệ nhân viên Ariess Fitness"
        });
    }

    await updateVerifyPhoto(member.id, verifyPath);
    res.json({
        message:"Cập nhật ảnh xác minh thành công",
        verify_photo: verifyPath
    })
}
module.exports={
    updateProfile, uploadAvatar,
    updateInfoMember,
    uploadVerifyPhoto
}