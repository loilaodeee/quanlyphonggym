const { findMemberByAccountId, createMember, updateVerifyPhoto } = require("../models/memberModel");
const { createMemberPackage, refreshMemberPackageStatus, getWaitingPackage, getCurrentPackage, extendMemberPackage } = require("../models/memberPackageModel");
const { createMemberService } = require("../models/memberServiceModel");
const { createMemTrainerPackage } = require("../models/memberTrainerPackModel");
const { getPackageById } = require("../models/packageModel");
const { createPayment, getPaymentById, updateTranferContent, findPaymentByContent, updatePaymentStatus, updateMemberPackId, updateMemberServiceId, updateMemTrainerPackageId, updateAccountId, createRenewPayment } = require("../models/paymentModel");
const { getServiceById } = require("../models/serviceModel");
const { getTrainerPackageById } = require("../models/trainerPackageModel");
const { createUser } = require("../models/userModel");
const db=require("../config/db");

const createPackPayment=async(req, res)=>{

    const {package_id}=req.body;
    const packageInfo= await getPackageById(package_id);
    if(!packageInfo){
        res.status(404).json({
            message:"Không tìm thấy gói tập"
        })
    }
    const paymentId= await createPayment(req.user.id, packageInfo.id,null, null,null, packageInfo.price, "bank", "buy_package");
    const transferContent=`ARIESS${paymentId}`;
    await updateTranferContent(paymentId, transferContent);
    res.json({
        payment_id: paymentId,
        amount: packageInfo.price,
        transfer_content: transferContent
    })
}
const createServicePayment=async(req, res)=>{
    const {service_id}=req.body;
    const serviceInfo=await getServiceById(service_id);
    if(!serviceInfo){
        res.status(404).json({
            message:"Không tìm thấy dịch vụ"
        })
    }
    const paymentId= await createPayment(req.user.id, null, null, serviceInfo.id,null, serviceInfo.price, "bank", "buy_service");
    const transferContent=`ARIESS${paymentId}`;
    await updateTranferContent(paymentId, transferContent);
    res.json({
        payment_id: paymentId,
        amount: serviceInfo.price,
        transfer_content: transferContent
    })
}

const createTrainerPayment=async(req, res)=>{
    const {trainer_package_id, trainer_id}=req.body;
    const trainerPackage=await getTrainerPackageById(trainer_package_id);
    if(!trainerPackage){
        return res.status(404).json({
            message:"Không tìm thấy gói PT"
        })
    }
    const paymentId= await createPayment(req.user.id, null, trainer_package_id, null,
        trainer_id, trainerPackage.price, "bank", "buy_trainer"
    );
    const transferContent=`ARIESS${paymentId}`;
    await updateTranferContent(paymentId, transferContent);
    res.json({
        payment_id: paymentId,
        amount: trainerPackage.price,
        transfer_content: transferContent
    })

}

const getPayment=async(req, res)=>{
    const {id}=req.params;
    const payment=await getPaymentById(id);
    if(!payment){
        return res.status(404).json({
            message:"Không tìm thấy đơn thanh toán này"
        })
    }
    res.json(payment);
}

const webhookPay=async (req, res)=>{
    
    let connection;

    try {
        connection=await db.getConnection();

        await connection.beginTransaction();
        const {content, transferAmount}=req.body;

        const payment=await findPaymentByContent(content);
        if(!payment){
            return res.status(200).json({
                success:true
            });
        }

        if(payment.status==="paid"){
            return res.status(200).json({
                success:true
            })
        }

        if(Number(payment.price)!== Number(transferAmount)){
            return res.status(200).json({
                success:true
            })
        }

        if(payment.payment_type==="buy_package"){
            if(payment.account_id===null){
                const accountId= await createUser(payment.customer_email, payment.customer_password, payment.customer_phone, payment.customer_fullname, connection);
                const memberCode="HV"+String(accountId).padStart(6,"0");
                const memberId=await createMember(accountId, memberCode, connection);

                await updateVerifyPhoto(memberId, payment.customer_verify_photo, connection);
                const gymPackage=await getPackageById(payment.package_id, connection);

                const startDate=new Date().toISOString().split("T")[0];
                const endDate=new Date();
                endDate.setMonth(endDate.getMonth()+gymPackage.duration_month);

                const endStrDate=endDate.toISOString().split("T")[0];

                const memPackageId=await createMemberPackage(memberId, payment.package_id, startDate, endStrDate,'active', connection);

                await updateAccountId(payment.id, accountId, connection);
                await updateMemberPackId(payment.id, memPackageId, connection);
                await updatePaymentStatus(payment.id, connection);
            }
            else{
                const member=await findMemberByAccountId(payment.account_id, connection)
                let memberId;
                if(!member){
                    const memberCode="HV"+String(payment.account_id).padStart(6, "0")
                    memberId=await createMember(payment.account_id, memberCode, connection);
                }
                else{
                    memberId=member.id
                }

                const gymPackage= await getPackageById(payment.package_id, connection);

                const startDate=new Date().toISOString().split("T")[0];
                const endDate=new Date();

                endDate.setMonth(endDate.getMonth()+gymPackage.duration_month);

                const endStr= endDate.toISOString().split("T")[0];

                const memPackageId=await createMemberPackage(memberId, payment.package_id, startDate, endStr,'active', connection);

                await updateMemberPackId(payment.id, memPackageId, connection);
                await updatePaymentStatus(payment.id, connection);
            }
            
        }

        if(payment.payment_type==="buy_service"){
            const member=await findMemberByAccountId(payment.account_id, connection);
            const memServiceId=await createMemberService(member.id, payment.service_id, connection);
            await updateMemberServiceId(payment.id, memServiceId, connection);
            await updatePaymentStatus(payment.id, connection);

        }

        if(payment.payment_type==="buy_trainer"){
            const member=await findMemberByAccountId(
                    payment.account_id, connection
                );

            const trainerPackage=await getTrainerPackageById(
                    payment.trainer_package_id, connection
                );

            const memTrainerPackageId=await createMemTrainerPackage(
                    member.id,
                    payment.trainer_id,
                    payment.trainer_package_id,
                    trainerPackage.sessions,
                    connection
                );

            await updateMemTrainerPackageId(
                payment.id,
                memTrainerPackageId,
                connection
            );
            await updatePaymentStatus(payment.id, connection);
            
        }

        if(payment.payment_type==="renew_package"){
            const member=await findMemberByAccountId(payment.account_id, connection);
            await refreshMemberPackageStatus(member.id, connection);

            const currentPackage=await getCurrentPackage(member.id, connection);
            const gymPackage=await getPackageById(payment.package_id, connection);

            const isSamePackage =currentPackage.package_id === payment.package_id;

            const today=new Date();
            today.setHours(0, 0, 0, 0);

            const oldEnd=new Date(currentPackage.end_date);
            oldEnd.setHours(0, 0, 0, 0);

            let startDate;

            if(oldEnd > today){

                startDate = new Date(oldEnd);

                startDate.setDate(
                    startDate.getDate()+1
                );

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

                memberPackageId =currentPackage.id;

            }
            else{

                memberPackageId =
                    await createMemberPackage(
            
                        member.id,
            
                        payment.package_id,
            
                        startStrDate,
            
                        endStrDate,
            
                        oldEnd > today
                            ? "waiting"
                            : "active",
            
                        connection
            
                    );
            
            }
            await updateMemberPackId(payment.id, memberPackageId, connection);
            await updatePaymentStatus(payment.id, connection);
        }   
        await connection.commit();


        res.status(200).json({
            success: true
        });
    } catch (error) {
        if(connection){
            await connection.rollback();
        }
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
    finally{
        if(connection){
            await connection.release();
        }
    }
    
}

const createRenewPackagePayment=async(req, res)=>{
    const {packageId}=req.body;;
    if(!packageId){
        return res.status(400).json({
            message:"Vui lòng chọn gói tập"
        })
    }

    const member=await findMemberByAccountId(req.user.id);
    if(!member){
        return res.status(404).json({
            message:"Không tìm thấy hội viên"
        })
    }
    await refreshMemberPackageStatus(member.id);

    const waitingPackage=await getWaitingPackage(req.user.id);
    if(waitingPackage){
        return res.status(400).json({
            message:"Bạn đã có gói tập chờ kích hoạt"
        })
    }

    const gymPackage=await getPackageById(packageId);
    if(!gymPackage){
        return res.status(404).json({
            message:"Không tìm thấy gói tập"
        })
    }

    const paymentId= await createRenewPayment(req.user.id, packageId, gymPackage.price);
    const transfer_content=`ARIESS${paymentId}`;
    await updateTranferContent(paymentId, transfer_content);
    res.json({
        payment_id: paymentId,
        amount: gymPackage.price,
        transfer_content: transfer_content
    })
}
module.exports={
    createPackPayment,
    createServicePayment,
    getPayment,
    webhookPay,
    createTrainerPayment,
    createRenewPackagePayment
}