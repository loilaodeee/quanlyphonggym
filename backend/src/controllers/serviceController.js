const { findMemberByAccountId } = require("../models/memberModel");
const { refreshMemberPackageStatus } = require("../models/memberPackageModel");
const { getAllServices, getCountServiceByMember, getMemberService, getIncludeService, getPurchaseService, updateServiceStatus, getServiceById, createMemberService, countTodayService, getPackageBenefit } = require("../models/serviceModel")

const getServices=async(req, res)=>{
    const services=await getAllServices();
    res.json(services);
}

const getCountServiceMember=async (req, res)=>{
    const member= await findMemberByAccountId(req.user.id);

    const count =await getCountServiceByMember(member.id);
    res.json(count);
}
const getServiceByMember=async (req, res)=>{
    const member= await findMemberByAccountId(req.user.id);
    const serviceMem= await getMemberService(member.id);

    res.json(serviceMem);
}

const getMyService=async(req, res)=>{
    const member= await findMemberByAccountId(req.user.id);
    if(!member){
        return res.json({
            included: [],
            purchased: []
        })
    }
    const included= await getIncludeService(member.id)
    const purchased= await getPurchaseService(member.id);

    res.json({
        included,
        purchased
    })
}

const requestUseService= async(req, res)=>{
    const {id}=req.params;
    let member=await findMemberByAccountId(req.user.id);

    await refreshMemberPackageStatus(member.id);

    member=await findMemberByAccountId(req.user.id);
    if(member.status !== 'active'){
        return res.status(400).json({
            message:"Bạn cần có gói tập đang hoạt động"
        })
    }
    await updateServiceStatus(id);
    res.json({
        message: "Sử dụng dịch vụ thành công"
    });
}

const getInfoServiceById=async(req, res)=>{
    const {id}=req.params;

    const service=await getServiceById(id);
    res.json(service);
}

const useIncludedService = async(req,res)=>{
    const {serviceId} = req.body;
    const member =
        await findMemberByAccountId(
            req.user.id
        );
    if(!member){
        return res.status(404).json({
            message:"Không tìm thấy hội viên"
        });
    }
    const benefit =
        await getPackageBenefit(
            member.id,
            serviceId
        );
    if(!benefit){
        return res.status(400).json({
            message:"Dịch vụ này không thuộc gói tập"
        });
    }

    if(
        benefit.limit_type !== "unlimited"
    ){
        const total =
            await countTodayService(
                member.id,
                serviceId
            );

        if(
            total >= benefit.limit_value
        ){
            return res.status(400).json({
                message:
                "Bạn đã sử dụng hết lượt hôm nay."
            });
        }
    }
    await createMemberService(
        member.id,
        serviceId
    );
    res.json({
        message:"Đã gửi yêu cầu sử dụng."
    });

}
module.exports={
    getServices,
    getCountServiceMember,
    getServiceByMember,
    getMyService,
    requestUseService,
    getInfoServiceById,

    useIncludedService
}