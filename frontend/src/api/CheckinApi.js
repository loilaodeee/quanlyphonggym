

import axiosClient from "./axios";

export async function getCountCheckinThisMonth(){
    const response=await axiosClient.get(
        "/member/checkin/count"
    );
    return response.data;
}

export async function getCheckinHistory(){
    const response=await axiosClient.get(
        "/member/schedule/history"
    );
    return response.data
}