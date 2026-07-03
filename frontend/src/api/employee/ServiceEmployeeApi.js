import axiosClient from "../axios";

export async function getEmployeeServices(keyword="", status="all", page=1, limit=10){
    const response=await axiosClient.get(
        "/employee/services",
        {
            params:{
                keyword, status, page, limit
            }
        }
    )
    return response.data;
}

export async function confirmService(serviceId){
    const response=await axiosClient.post(
        `/employee/services/${serviceId}/confirm`
    );
    return response.data;
}