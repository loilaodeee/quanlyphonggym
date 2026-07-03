
import axiosClient from "./axios";

export async function getTodaySchedule() {
    try {
        const response =await axiosClient.get(
            "/member/schedule/today"
        );
        return response.data;
    } catch (e) {
        console.error("Lỗi load lịch tập:", e);
        throw e;
    }
}

export async function getMySchedule(){
    try {
        const response= await axiosClient.get(
            "/member/schedule"
        );
        return response.data;
    } catch (e) {
        console.error("Lỗi load lịch tập:", e);
        throw e;
    }
}

export async function getBookingInfo(memTrainerPackageId){

    const response= await axiosClient.get(
        `/member/schedule/booking/${memTrainerPackageId}`
    );
    return response.data;   
}

export async function bookTrainerSchedule(data){
    const response=await axiosClient.post(
        "/member/schedule/book", data
    )
    return response.data
}

export async function cancelSchedule(id){
    const response=await axiosClient.post(
        `/member/schedule/${id}/cancel`
    );
    return response.data;
}