import axiosClient from "../axios";

export async function sellPackage(data){
    const formData= new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("fullname", data.fullname);
    formData.append("phone", data.phone);
    formData.append("packageId", data.packageId);
    formData.append("photo", data.photo);

    const response =await axiosClient.post(
        "/employee/sell-package/cash", formData
    );
    return response.data;
}

export async function createPackageQr(data){
    const formData=new FormData();

    formData.append("email",data.email);
    formData.append("password", data.password);
    formData.append("phone", data.phone);
    formData.append("fullname",data.fullname);
    formData.append("packageId", data.packageId);
    formData.append("photo", data.photo);

    const response=await axiosClient.post(
        "/employee/sell-package/bank", formData
    );
    return response.data;
}

export async function getEmployeePaymentSuccess(paymentId){
    const response=await axiosClient.get(
        `/employee/payment-success/${paymentId}`
    );
    return response.data
}

export async function getPackageSellHistory(keyword="", paymentMethod="all"){
    const response=await axiosClient.get(
        "/employee/sell-package/history",
        {
            params:{
                keyword,
                paymentMethod
            }
        }
    );
    return response.data;
}