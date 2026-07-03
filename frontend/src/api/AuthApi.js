
import axiosClient from "./axios";


export async function loginApi(loginData, password){
    try {
        const response=await axiosClient.post("auth/login",{
            loginData,
            password
        });
        return response.data;
    } catch (e) {
        console.error("Login failed:", e);
        throw e;
    }
}

export async function registerApi(email, password, phone, fullname){
    const response=await axiosClient.post(
        "/auth/register",
        {
            email: email,
            password: password,
            phone: phone,
            fullname: fullname
        }
    )
    return response.data;
}

export async function getProfileApi(){
    const response=await axiosClient.get(
        "auth/profile"
    );
    return response.data;
}

export async function getEmployeeProfileApi(){
    const response=await axiosClient.get(
        "/employee/profile"
    );
    return response.data;
}