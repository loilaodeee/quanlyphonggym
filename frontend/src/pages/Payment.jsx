import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import SideBar from "../components/SideBar";
import { AuthContext } from "../contexts/AuthContext";
import { FaCheck } from "react-icons/fa";

import {
    createMemTrainerPackPayment,
    createPackPayment,
    createServicePayment,

} from "../api/PaymentApi";

import "../styles/Payment.css";
import { getPackageById } from "../api/packageApi";
import { getServiceById } from "../api/ServiceApi";
import { getTrainerPackageById } from "../api/TrainerApi";
import useDocumentTitle from "../hooks/useDocumentTitle";

function Payment() {
    useDocumentTitle("Thanh toán");

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const id = searchParams.get("id");
    const type=searchParams.get("type");
    const trainerId= searchParams.get("trainer");
    const [info, setInfo] = useState(null);

    const [method, setMethod] = useState("bank");

    useEffect(() => {

        async function load() {

            if(type==="package"){
                const data = await getPackageById(id);
                setInfo(data);

            }
            if(type==="service"){
                const data=await getServiceById(id);
                setInfo(data);
            }
            if(type==="trainer"){
                const data=await getTrainerPackageById(id);
                setInfo(data);
            }
        }

        load();

    }, [id]);

    async function handlePay() {
        try {
            if(type==="package"){
                const result= await createPackPayment(id);
                navigate(`/checkout/${result.payment_id}?type=${type}`)
            }
            if(type==="service"){
                const result= await createServicePayment(id);
                navigate(`/checkout/${result.payment_id}?type=${type}`)
            }
            if(type==="trainer"){
                const result=await createMemTrainerPackPayment(id, trainerId);
                navigate(`/checkout/${result.payment_id}?type=${type}`)
            }
            

        } catch (e) {
            console.log(e);
        }
       


    }

    if (!info) {

        return null;

    }

    return (

        <div className="payment">

            <div className="payment-sidebar">

                <SideBar />

            </div>

            <div className="payment-content">

                <h1>CỔNG THANH TOÁN</h1>

                <div className="payment-wrapper">


                    <div className="payment-left">

                        <h2>

                            {info.package_name || info.service_name}

                        </h2>
                        {
                            type === "trainer" ? (
                                <>
                                    <div className="payment-desc">
                                        <FaCheck/> Số buổi: {info.sessions}
                                    </div>

                                    <div className="payment-desc">
                                    <FaCheck/> Huấn luyện viên cá nhân
                                    </div>

                                    <div className="payment-desc">
                                    <FaCheck/> Theo dõi tiến độ tập luyện
                                    </div>
                                </>
                            ) : (
                                info.description?.split("\n").map(
                                    (line,index)=>(
                                        <div
                                            className="payment-desc"
                                            key={index}
                                        >
                                            <span className="payment-check">
                                                <FaCheck />
                                            </span>

                                            <span>{line}</span>

                                        </div>
                                    )
                                )
                            )
                        }

                        <div className="payment-price">


                            <span>

                               Giá: {"    "} {info.price.toLocaleString()}đ

                            </span>

                        </div>

                    </div>


                    <div className="payment-right">

                        <h2>

                            Phương thức thanh toán

                        </h2>

                        <div className="payment-method">

                            <label>

                                <input

                                    type="radio"

                                    checked={method === "bank"}

                                    onChange={() =>

                                        setMethod("bank")

                                    }

                                />

                                Chuyển khoản

                            </label>


                        </div>

                        <div className="payment-summary">

                            <div className="payment-total">

                                <span>

                                    Tổng cộng

                                </span>

                                <span>

                                    {info.price.toLocaleString()}đ

                                </span>

                            </div>

                        </div>

                        <button

                            className="payment-btn"

                            onClick={handlePay}

                        >

                            THANH TOÁN NGAY

                        </button>

                        <div className="payment-note">

                            Sau khi thanh toán thành công hệ thống sẽ tự động kích hoạt dịch vụ của bạn.

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Payment;