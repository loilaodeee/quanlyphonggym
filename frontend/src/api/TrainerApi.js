import memTrainerPackages from "../mockApi/memTrainerPackage";
import trainerPackages from "../mockApi/trainerPackages";

import axiosClient from "./axios";

export async function getTrainers(){
    try {
        const response=await axiosClient.get(
            "/trainers"
        );
        return response.data;
    } catch (e) {
        console.error("Lỗi load trainers:", e);
        throw e;
    }
}

export async function getCountPTActive(){
    try {
        const response=await axiosClient.get(
            "member/trainer/count"
        );
        return response.data;
    } catch (e) {
        console.error("Lỗi:", e);
        throw e;
    }
}

export async function getCompletedSessions(){
    const response=await axiosClient.get(
        "member/trainer/completed-session"
    );
    return response.data;
}

export async function getTrainerById(id){
    const response=await axiosClient.get(
        `/trainers/${id}`
    );
    return response.data;
}

export async function getTrainerPackages(){
    const response=await axiosClient.get(
        "/trainer-packages"
    );
    return response.data;
}

export async function getTrainerPackageById(id){
    const response=await axiosClient.get(
        `/trainer-packages/${id}`
    );
    return response.data;
}
export async function getMyTrainerPackages() {

    const response=await axiosClient.get(
        "/member/my-trainer-package"
    );
    return response.data;
}

export async function getActiveTrainerPackages() {
    const response=axiosClient.get(
        "/member/trainer/active-packages"
    );
    return (await response).data;
}