import axiosClient from "../axios";

export async function getMemberRenewInfo(memberCode){

    const response=await axiosClient.get(
            `/employee/renew-package/${memberCode}`

        );

    return response.data;

}

export async function renewMemberPackage(data){
    const response=await axiosClient.post(
        "/employee/renew-package/cash", data
    );
    return response.data;
}

export async function renewMemberPackageQr(memberId, packageId){
    const response=await axiosClient.post(
        "/employee/renew-package/bank",
        {
            memberId, packageId
        }
    )
    return response.data;
}