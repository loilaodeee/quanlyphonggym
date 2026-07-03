import axiosClient from "../axios";

export async function getTrainerDashboard(){

    const response=
        await axiosClient.get(
            "/trainer/dashboard"
        );

    return response.data;

}

export async function getTrainerSchedules(
    date="",
    status="all"
){

    const response =
        await axiosClient.get(
            "/trainer/schedules",
            {
                params:{
                    date,
                    status
                }
            }
        );
    return response.data;
}

export async function getTrainerMemberDetail(id){
    const response=await axiosClient.get(
            `/trainer/member/${id}`
        );

    return response.data;
}

export async function confirmTrainerSchedule(id){
    const response= await axiosClient.post(
            `/trainer/schedule/${id}/complete`
        );
    return response.data;
}

export async function getTrainerMembers(
    keyword,
    status
){
    const response =await axiosClient.get(
            "/trainer/members",
            {
                params:{
                    keyword,
                    status
                }
            }
        );
    return response.data;
}

export async function getTrainerProfile(){
    const response =await axiosClient.get(
            "/trainer/profile"
        );
    return response.data;
}

export async function uploadTrainerAvatar(file){

    const formData = new FormData();

    formData.append("avatar", file);

    const response =await axiosClient.post(
            "/users/avatar",
            formData
        );
    return response.data;
}

export async function updateTrainerProfileInfo(

    fullname,
    phone

){
    const response =await axiosClient.put(
            "/users/profile",
            {
                fullname,
                phone
            }
        );
    return response.data;
}

export async function updateTrainerInfo(data){
    const response= await axiosClient.put(
            "/trainer/profile",
            data
        );
    return response.data;
}