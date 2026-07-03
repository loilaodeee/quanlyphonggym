import { Await } from "react-router-dom";

import axiosClient from "./axios";

export async function getPackages(){
    try {
        const response=await axiosClient.get(
            "/packages"
        );
        return response.data;
    } catch (e) {
        console.error("Lỗi load packages:", e);
        throw e;
    }
}
export async function getPackageById(id){
    try {
       const response=await axiosClient.get(
        `/packages/${id}`
       )
       return response.data;
    } catch (e) {
        console.error("Lỗi load package:", e);
        throw e;
    }
}

export async function getMyPackage(){
    try {
        const response=await axiosClient.get(
            "/member/my-package"
        );
        return response.data;
    } catch (e) {
        console.error("Lỗi load my package:", e);
        throw e;
    }
}