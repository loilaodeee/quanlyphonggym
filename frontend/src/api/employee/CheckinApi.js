import axiosClient from "../axios";

export async function getMemberByCode(memberCode){
    const response=await axiosClient.get(
        `/employee/member/${memberCode}`
    );
    return response.data;
}

export async function checkInMember(memberId, memberCode){
    const response=await axiosClient.post(
        "/employee/checkin", {
            memberId, memberCode
        }
    );
    return response.data;
}

export async function getRecentCheckins(){
    const response=await axiosClient.get(
        "/employee/recent-checkins"
    );
    return response.data
}