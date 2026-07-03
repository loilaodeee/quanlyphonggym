import axiosClient from "../axios";

export async function getDashboard(){
    const response=await axiosClient.get(
        "/employee/dashboard"
    );
    return response.data;
}

export async function getPendingServices(){
    const response=await axiosClient.get(
        "/employee/pending-services"
    );
    return response.data;
}