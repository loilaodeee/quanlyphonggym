import axiosClient from "../axios";

export async function getMembers(keyword="", status="", page=1, limit=10){
    const response=await axiosClient.get(
        "/employee/members",
        {
            params:{
                keyword, status, page, limit
            }
        }

    );
    return response.data
}

export async function getMemberDetail(id){

    const response=
        await axiosClient.get(
            `/employee/members/${id}`
        );

    return response.data;

}

export async function getMemberHistory(id){

    const response =await axiosClient.get(
            `/employee/members/${id}/history`
        );

    return response.data;

}

export async function getMemberCheckin(id){

    const response=await axiosClient.get(
            `/employee/members/${id}/checkins`
        );

    return response.data;

}
export async function getMemberServices(id){

    const response=await axiosClient.get(
            `/employee/members/${id}/services`
        );

    return response.data;

}
export async function getMemberTrainerHistory(id){

    const response=await axiosClient.get(`/employee/members/${id}/trainers`);

    return response.data;

}

export async function updateMember(id,data){

    const response=await axiosClient.put(
        `/employee/members/${id}`,
        data
    );

    return response.data;

}

