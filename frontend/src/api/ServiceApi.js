import memberPackages from "../mockApi/memberPackages";
import memberServices from "../mockApi/memberService";
import packageServices from "../mockApi/packageServices";
import services from "../mockApi/services";
import axiosClient from "./axios";

export async function getServices(){
    try {
        const response=await axiosClient.get(
            "/services"
        );
        return response.data;
    } catch (e) {
        console.error("Lỗi load services:", e);
        throw e;
    }
}

export async function getCountServiceMember(){
    try {
        const response=await axiosClient.get(
            "/member/service/count"
        );
        return response.data;
    } catch (e) {
        console.error("Lỗi:", e);
        throw e;
    } 
}

export async function getMemberService(){
    try {
        const response=await axiosClient.get(
            "/member/my-service"
        );
        return response.data;
        
    } catch (e) {
        console.error("Lỗi:", e);
        throw e;
    }
}

export async function getMyServices(){

    const response=await axiosClient.get(
        "/member/my-services"
    );
    return response.data;
}

export async function getUsedServices(memberId){

    return memberServices.filter(item=>
            item.member_id===memberId &&
            item.status==="used"
        )

        .map(item=>{
            const service=services.find(
                s=>s.id===item.service_id
            );

            return{
                ...item,
                service_name:service.service_name
            };

        });

}
export async function updateServiceStatus(memberServiceId) {
    const response=await axiosClient.put(
        `/member/service/${memberServiceId}/use`
    );
    return response.data;

}

export async function getServiceById(id){
    const response=await axiosClient.get(
        `/services/${id}`
    );
    return response.data;
}

export async function requestIncludedService(serviceId){

    const response = await axiosClient.post(
        "/member/services/included",
        {
            serviceId
        }
    );

    return response.data;
}