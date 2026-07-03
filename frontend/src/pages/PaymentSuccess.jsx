import { Link, useSearchParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";

import "../styles/PaymentSucccess.css";

import { AuthContext } from "../contexts/AuthContext";
import { getProfileApi } from "../api/AuthApi";
import useDocumentTitle from "../hooks/useDocumentTitle";

function PaymentSuccess() {
    useDocumentTitle("Thanh toán");
    const { user, setUser } = useContext(AuthContext);
    const [searchParams]=useSearchParams();

    const type=searchParams.get("type");

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadProfile() {

            try {

                const response =
                    await getProfileApi();
                const userData= response.user;
                setUser(userData);

                localStorage.setItem(
                    "user",
                    JSON.stringify(userData)
                );

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        }

        loadProfile();

    }, [setUser]);

    if (loading) {

        return (
            <div className="payment-success">
                <h2>Đang cập nhật thông tin hội viên...</h2>
            </div>
        );

    }

    return (

        <div className="payment-success">

            <div className="payment-success-box">

                <FaCheckCircle
                    className="success-icon"
                />

                <h1>
                    Thanh toán thành công
                </h1>
                {
                    type==="package" && (
                        <>
                        <p className="success-message">

                        Chúc mừng bạn đã trở thành hội viên của
                        Ariess Fitness <FaCircleCheck className="success-inline-icon" />

                        </p>

                        {
                        user?.member && (

                            <div className="member-info">

                                <div className="member-info-row">

                                    <span>Mã hội viên:</span>

                                    <strong>
                                        {user.member.member_code}
                                    </strong>

                                </div>

                                <div className="member-info-row">

                                    <span>Trạng thái:</span>

                                    <strong>
                                        {
                                            user.member.status === "active"
                                                ? "Đang hoạt động"
                                                : "Không hoạt động"
                                        }
                                    </strong>

                                </div>

                            </div>

                        )
                        }

                        <div className="success-actions">

                        <Link to="/member/my-package">

                            <button
                                className="package-btn"
                            >

                                Xem gói tập của tôi

                            </button>

                        </Link>

                        <Link to="/member">

                            <button
                                className="home-btn"
                            >

                                Về trang chủ

                            </button>

                        </Link>

                        </div>
                    </>
                    )
                }
                {
                    type==="service"&&
                    (
                        <>
                            <p className="success-message">
                                Đăng ký dịch vụ thành công <FaCircleCheck className="success-inline-icon" />
                            </p>

                            <p>
                                Dịch vụ của bạn đã được kích hoạt và sẵn sàng sử dụng.
                            </p>

                            <div className="success-actions">

                                <Link to="/member/my-service">
                                    <button className="package-btn">
                                        Xem dịch vụ của tôi
                                    </button>
                                </Link>

                                <Link to="/member">
                                    <button className="home-btn">
                                        Về trang chủ
                                    </button>
                                </Link>

                            </div>
                        </>
                    )
                   
                }
                {
                    type==="trainer" && (

                        <>
                            <p className="success-message">
                                Đăng ký gói PT thành công <FaCircleCheck className="success-inline-icon" />
                            </p>

                            <p>
                                Huấn luyện viên cá nhân đã được kích hoạt.
                            </p>

                            <p>
                                Bạn có thể bắt đầu đặt lịch tập với PT.
                            </p>

                            <div className="success-actions">

                                <Link to="/member/my-trainer-package">

                                    <button className="package-btn">

                                        Xem gói PT của tôi

                                    </button>

                                </Link>

                                <Link to="/member">

                                    <button className="home-btn">

                                        Về trang chủ

                                    </button>

                                </Link>

                            </div>

                        </>

                    )
                }
                {
                    type === "renew-package" && (

                        <>

                            <p className="success-message">
                                Gia hạn gói tập thành công <FaCircleCheck className="success-inline-icon" />
                            </p>

                            <p>
                                Gói tập của bạn đã được gia hạn thành công.
                            </p>

                            <p>
                                Nếu đây là gói khác với gói hiện tại, hệ thống sẽ tự động kích hoạt
                                khi gói hiện tại kết thúc.
                            </p>

                            <div className="success-actions">

                                <Link to="/member/my-package">

                                    <button className="package-btn">

                                        Xem gói tập của tôi

                                    </button>

                                </Link>

                                <Link to="/member">

                                    <button className="home-btn">

                                        Về trang chủ

                                    </button>

                                </Link>

                            </div>

                        </>

                    )
                }    
                
                

            </div>

        </div>

    );

}

export default PaymentSuccess;