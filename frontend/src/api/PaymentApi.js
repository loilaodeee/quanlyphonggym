import axiosClient from "./axios";

export async function createPackPayment(packageId) {
    const response=await axiosClient.post(
        "payments/package",
        {
            package_id: packageId
        }
    );
    return response.data;
}

export async function createServicePayment(serviceId) {
    const response=await axiosClient.post(
        "payments/service",
        {
            service_id: serviceId
        }
    );
    return response.data;
}

export async function createMemTrainerPackPayment(trainerPackageId, trainerId) {
    const response=await axiosClient.post(
        "payments/trainer",
        {
            trainer_package_id: trainerPackageId,
            trainer_id: trainerId
        }
    );
    return response.data;
}



export async function getPaymentById(id){
    const response=await axiosClient.get(
        `/payments/${id}`
    );
    return response.data;
}

export const renewPackagePayment = async (packageId) => {

    const response = await axiosClient.post(
        "/payments/renew-package/bank",
        {
            packageId
        }
    );

    return response.data;

};