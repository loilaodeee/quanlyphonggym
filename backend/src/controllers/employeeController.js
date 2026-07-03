const {checkEmail, createUser, getEmployeeProfile}= require("../models/userModel");
const {createMember, updateVerifyPhoto, findMemberRenewInfo, getAccountByMember, getAllMembers, getMemberDetailById, updateMemberByEmployee}=require("../models/memberModel");
const {getPackageById, getAllPackages}=require("../models/packageModel")

const {createMemberPackage, getCurrentPackage, extendMemberPackage, refreshMemberPackageStatus, getWaitingPackage}=require("../models/memberPackageModel");
const {createPayment, updatePaymentStatus, updateMemberPackId, updateTranferContent, createEmployeePayment, getEmployeePaymentSuccess, getPackageSellHistory, getMemberPackageHistory}=require("../models/paymentModel");
const bcrypt=require("bcrypt");

const db=require("../config/db");
const { getMemberCheckinHistory } = require("../models/checkinModel");
const { getMemberServiceHistory, getEmployeeServicesModel, confirmService } = require("../models/serviceModel");
const { getMemberTrainerHistory } = require("../models/trainerPackageModel");
const { getEmployeeDashboard, getPendingServices } = require("../models/dashboardModel");


const sellPackage=async (req, res)=>{

    let connection;
    try {
        

        connection=await db.getConnection();

        await connection.beginTransaction();
        const {email, password, fullname, phone, packageId}=req.body;


        const existEmail=await checkEmail(email, connection);

        if(!email || !password || !fullname || !phone || !packageId){
            return res.status(400).json({
                message:"Vui lòng nhập đầy đủ thông tin"
            })
        }
        
        if(!req.file){

            return res.status(400).json({
                message:"Vui lòng chọn ảnh xác minh"
            });
        
        }

        if(existEmail){
            return res.status(400).json({
                message:"Email đã tồn tại"
            })
        }
        const hashPass=await bcrypt.hash(password, 10);
        
        const accountId=await createUser(email, hashPass, phone, fullname, connection);
        const memberCode="HV"+String(accountId).padStart(6, "0");

        const memberId=await createMember(accountId, memberCode, connection);
        const verifyPhoto=`/uploads/avatars/${req.file.filename}`;

        await updateVerifyPhoto(memberId, verifyPhoto, connection);
        const gymPackage=await getPackageById(packageId, connection);

        const startDate=new Date().toISOString().split("T")[0];
        const endDate=new Date();
        endDate.setMonth(endDate.getMonth()+gymPackage.duration_month);
        const endStrDate=endDate.toISOString().split("T")[0];

        const memberPackageId =await createMemberPackage(memberId, packageId, startDate, endStrDate, 'active', connection);

        const paymentId= await createPayment(accountId, packageId, null, null, null, gymPackage.price, "cash","buy_package", connection);

        await updateMemberPackId(paymentId, memberPackageId, connection);
        await updatePaymentStatus(paymentId, connection);

        await connection.commit();
        res.json({
            message:"Bán gói tập thành công",
            member:{
                email,
                password,
                fullname,
                phone,
                member_code: memberCode,
                package_name: gymPackage.package_name,
                start_date: startDate,
                end_date:endStrDate,
                payment_method: "Tiền mặt",
                amount: gymPackage.price
            }
        })
        
    } catch(error) {
        if(connection){
            await connection.rollback();
        }

        console.log(error);
        return res.status(500).json({
            message:"Bán gói tập thất bại"
        });
    }

    finally{
        if(connection){
            await connection.release();
        }
        
    }

}

const getPackages=async(req, res)=>{
    const packages= await getAllPackages();
    res.json(packages);
}

const createPackageQr=async (req, res)=>{
    const {fullname, email, phone, password, packageId}=req.body;
    if(!req.file){
        return res.status(400).json({
            message:"Vui lòng chọn ảnh xác minh"
        })
    }
    if(!fullname || !email || !phone || !password || !packageId){
        return res.status(400).json({
            message:"Vui lòng nhập đầy đủ thông tin"
        })
    }
    const existEmail=await checkEmail(email);
    if(existEmail){
        return res.status(400).json({
            message:"Email đã tồn tại"
        })
    }

    const hashPass=await bcrypt.hash(password, 10);
    const gymPackage=await getPackageById(packageId);

    const verifyPhoto=`/uploads/avatars/${req.file.filename}`;

    const paymentId=await createEmployeePayment(null, packageId, null, null, null, gymPackage.price,
        fullname, email, phone, hashPass, verifyPhoto);
    
    const transferContent=`ARIESS${paymentId}`

    await updateTranferContent(paymentId, transferContent);

    res.json({
        payment_id:paymentId,
        amount: gymPackage.price,
        transfer_content: transferContent
    })

}

const getEmploySuccess=async(req, res)=>{
    const data=await getEmployeePaymentSuccess(req.params.paymentId);
    if(!data){
        return res.status(404).json({
            message:"Không tìm thấy đơn thanh toán này"
        })
    }
    res.json(data);
}

const getSellHistory=async (req, res)=>{
    const keyword=req.query.keyword||"";
    const paymentMethod=req.query.paymentMethod||"all";
    
    const history=await getPackageSellHistory(keyword, paymentMethod);
    res.json(history);
}

const getRenewMember=async(req, res)=>{
    const memberCode=req.params.memberCode;
    const member=await findMemberRenewInfo(memberCode);
    if(!member){
        return res.status(404).json({
            message:"Không tìm thấy hội viên này"
        })
    }
    res.json(member);
}

const renewPackage=async (req, res)=>{
    let connection;
    try {
        connection=await db.getConnection();
        await connection.beginTransaction();

        const {memberId, packageId}=req.body;
        

        if(!memberId || !packageId){
            return res.status(400).json({
                message:"Vui lòng nhập đầy đủ thông tin"
            })
        }
        const member=await getAccountByMember(memberId, connection);

        await refreshMemberPackageStatus(memberId, connection);

        const waitingPackage=await getWaitingPackage(member.account_id);
        if(waitingPackage){
            return res.status(400).json({
                message: "Hội viên đã có gói tập chờ kích hoạt"
            })
        }

        const currentPackage=await getCurrentPackage(memberId, connection);
        if(!currentPackage){
            return res.status(400).json({
                message:"Hội viên chưa có gói tập nào"
            })
        }

        const gymPackage=await getPackageById(packageId, connection);
        
        const isSamePackage =currentPackage.package_id === packageId;

        const today=new Date();
        today.setHours(0, 0, 0, 0);

        const oldEnd=new Date(currentPackage.end_date);
        oldEnd.setHours(0, 0, 0, 0);

        let startDate;

        if(oldEnd > today){

            startDate = new Date(oldEnd);

            startDate.setDate(startDate.getDate()+1);

        }
        else{

            startDate = today;

        }

        const endDate=new Date(startDate);
        endDate.setMonth(endDate.getMonth()+gymPackage.duration_month);
        const startStrDate=startDate.toISOString().split("T")[0];
        const endStrDate=endDate.toISOString().split("T")[0];

        let memberPackageId;

        if(isSamePackage){

            await extendMemberPackage(
                currentPackage.id,
                endStrDate,
                connection
            );

            memberPackageId = currentPackage.id;

        }
        else{

            memberPackageId =
                await createMemberPackage(
                    memberId,
                    packageId,
                    startStrDate,
                    endStrDate,
                    oldEnd>today ? 'waiting' : 'active',
                    connection
                );

        }

        
        const paymentId=await createPayment(member.account_id, packageId, null, null, null, gymPackage.price, "cash","renew_package", connection);

        await updateMemberPackId(paymentId, memberPackageId, connection);
        await updatePaymentStatus(paymentId, connection);

        await connection.commit();
        res.json({
            message:"Gia hạn gói tập thành công",

        })

    } catch (error) {
        if(connection){
            await connection.rollback();
        }
        console.log(error);
        return res.status(500).json({
            message:"Gia hạn gói tập thất bại"
        })
        
    }
    finally{
        if(connection){
            await connection.release();
        }
    }
}

const createRenewPackageQr=async (req, res)=>{
    const {memberId, packageId}=req.body;

    if(!memberId || !packageId){
        return res.status(400).json({
            message:"Vui lòng nhập đầy đủ thông tin"
        })
    }

    const member=await getAccountByMember(memberId);
    if(!member){
        return res.status(404).json({
            message: "Không tìm thấy hội viên"
        })
    }

    await refreshMemberPackageStatus(memberId);

    const gymPackage= await getPackageById(packageId);

    if(!gymPackage){
        return res.status(404).json({
            message:"Không tìm thấy gói tập"
        })
    }
    const paymentId= await createPayment(member.account_id, packageId, null, null, null, gymPackage.price, "bank", "renew_package");

    const transferContent=`ARIESS${paymentId}`;
    await updateTranferContent(paymentId, transferContent);

    res.json({
        payment_id: paymentId,
        amount: gymPackage.price,
        transfer_content: transferContent
    })
}

const getMembers=async (req, res)=>{

    const keyword=req.query.keyword||"";
    const status=req.query.status||"all";

    const page=Number(req.query.page)||1;

    const limit=Number(req.query.limit)||10;

    const offset=(page-1)*limit;
    const members=await getAllMembers(keyword, status, limit, offset);
    res.json(members);
}

const getMemberDetail = async(req,res)=>{

    const {id}=req.params;

    const member=
        await getMemberDetailById(id);

    if(!member){

        return res.status(404).json({
            message:"Không tìm thấy hội viên"
        });

    }

    res.json(member);

}

const getMemberHistory = async(req,res)=>{

    const {id}=req.params;

    const member =
        await getAccountByMember(id);

    if(!member){

        return res.status(404).json({
            message:"Không tìm thấy hội viên"
        });

    }

    const history =
        await getMemberPackageHistory(
            member.account_id
        );

    res.json(history);

}

const getMemberCheckin = async(req,res)=>{

    const {id}=req.params;

    const history=await getMemberCheckinHistory(id);

    res.json(history);

}

const getMemberServiceHistoryController=async(req,res)=>{

    const {id}=req.params;

    const history=
        await getMemberServiceHistory(id);

    res.json(history);

}

const getMemberTrainerHistoryController=async(req,res)=>{

    const history=await getMemberTrainerHistory(req.params.id);

    res.json(history);

}

const updateMember=async(req,res)=>{

    let connection;

    try{

        connection=await db.getConnection();

        await connection.beginTransaction();

        const {id}=req.params;

        const {
            fullname,
            phone,
            gender,
            birthday,
            height,
            weight,
            address
        }=req.body;

        const member=
            await getAccountByMember(
                id,
                connection
            );

        if(!member){

            return res.status(404).json({
                message:"Không tìm thấy hội viên"
            });

        }

        let verifyPhoto=null;

        if(req.file){

            verifyPhoto=
                `/uploads/avatars/${req.file.filename}`;

        }

        await updateMemberByEmployee(
            id,
            fullname,
            phone,
            gender,
            birthday,
            height,
            weight,
            address,
            verifyPhoto,
            connection
        );

        await connection.commit();

        res.json({
            message:"Cập nhật thành công"
        });

    }

    catch(error){

        if(connection){

            await connection.rollback();

        }

        console.log(error);

        res.status(500).json({
            message:"Cập nhật thất bại"
        });

    }

    finally{

        if(connection){

            connection.release();

        }

    }

}

const getEmployeeServices = async(req,res)=>{

    const {
        keyword="",
        status="all",
        page=1,
        limit=10
    } = req.query;

    const offset=(page-1)*limit;

    const data=await getEmployeeServicesModel(
        keyword,
        status,
        Number(limit),
        offset
    );

    res.json(data);

}

const confirmServiceEmployee=async (req, res)=>{
    const {serviceId}=req.params;
    await confirmService(serviceId);
    res.json({
        message:"Xác nhận thành công"
    })
}

const dashboard=async(req,res)=>{

    const data=await getEmployeeDashboard();

    res.json(data);

}

const pendingServices=async(req,res)=>{

    const data=await getPendingServices();

    res.json(data);

}

const getProfile = async (req,res)=>{

    const profile = await getEmployeeProfile(req.user.id);

    res.json(profile);

}

module.exports={
    sellPackage,
    getPackages,
    createPackageQr,
    getEmploySuccess,
    getSellHistory,
    getRenewMember,
    renewPackage,
    createRenewPackageQr,
    getMembers,
    getMemberDetail,

    getMemberHistory,
    getMemberCheckin,
    getMemberServiceHistoryController,
    getMemberTrainerHistoryController,
    updateMember,
    getEmployeeServices,
    confirmServiceEmployee,

    dashboard,
    pendingServices,

    getProfile
}