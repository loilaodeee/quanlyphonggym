
import axiosClient from "./axios";

export async function updateProfileApi(fullname, phone){
    const response=await axiosClient.put(
        "/users/profile",
        {
            fullname, phone
        }
    );
    return response.data;
}

export async function uploadAvatarApi(file){
    const formData= new FormData();
    formData.append("avatar", file);
    const response=await axiosClient.post(
        "/users/avatar", formData
    )
    return response.data;
}

export async function updateMemberInfo(data){
    const response=await axiosClient.put(
        "/member/health", data
    );
    return response.data;
}

export async function uploadVerifyPhoto(file){
    const formData= new FormData();
    formData.append("photo", file);
    
    const response=await axiosClient.post(
        `/member/verify-photo`, formData
    );
    return response.data;
}