import { useEffect,useState } from "react";

import { useNavigate,useParams, useSearchParams } from "react-router-dom";

import QRCode from "react-qr-code";
import { toast } from "react-toastify";

import {
    getEmployeePaymentSuccess
} from "../../api/employee/SellPackageApi";

import { formatDate } from "../../utils/date";
import PrintMemberCard from "../../components/PrintMemberCard";

import "../../styles/employee/EmployeeSuccess.css";
import "../../styles/employee/PrintMemberCard.css";
import useDocumentTitle from "../../hooks/useDocumentTitle";

function EmployeeSuccess(){
    useDocumentTitle("Thanh toán");
    const {paymentId}=useParams();

    const navigate=useNavigate();

    const [member,setMember]=useState(null);

    const [searchParams]=useSearchParams();

    const type=searchParams.get("type");

    useEffect(()=>{

        async function load(){

            const data=
                await getEmployeePaymentSuccess(
                    paymentId
                );

            setMember(data);

        }

        load();

    },[paymentId]);

    if(!member){

        return (
            <div className="sell-success-page">
                <div className="sell-success-card">
                    <p style={{color: "var(--gym-text-muted)"}}>Đang tải...</p>
                </div>
            </div>
        );

    }

    const qrValue=
        `http://localhost:5174/login?member=${member.member_code}`;

    const password= sessionStorage.getItem("employee-sell-password")||"*******";

    const isNewPackage = type === "employee-package";

    async function handleCopy(){
        await navigator.clipboard.writeText(
            `Mã hội viên: ${member.member_code}
Email: ${member.email}
Mật khẩu: ${password}
Gói tập: ${member.package_name}
Ngày hết hạn: ${formatDate(member.end_date)}
`
        );
        toast.success("Đã copy thông tin hội viên");
    }

    function handlePrint(){
        window.print();
    }

    return(

        <div className="sell-success-page">

            <div className="sell-success-card">

            <h2>
                {
                    type==="employee-renew"
                    ? "Gia hạn thành công"
                    : "Đăng ký thành công"
                }
            </h2>

            {
                isNewPackage && (
                    <>
                        <div className="sell-success-qr">
                            <QRCode
                                value={qrValue}
                                size={180}
                            />
                        </div>

                        <p className="sell-success-qr-hint">
                            Quét QR để mở nhanh trang đăng nhập
                        </p>
                    </>
                )
            }

                <div className="sell-success-rows">
                <div className="sell-success-row">
                    <span>Họ tên:</span>
                    <span>{member.fullname}</span>
                </div>

                <div className="sell-success-row">
                    <span>Mã hội viên:</span>
                    <span>{member.member_code}</span>
                </div>

                <div className="sell-success-row">
                    <span>Email:</span>
                    <span>{member.email}</span>
                </div>

                <div className="sell-success-row">
                    <span>SĐT:</span>
                    <span>{member.phone}</span>
                </div>

                {
                    isNewPackage && (
                        <div className="sell-success-row">
                            <span>Mật khẩu:</span>
                            <span>{password}</span>
                        </div>
                    )
                }

                <div className="sell-success-row">
                    <span>Gói tập:</span>
                    <span>{member.package_name}</span>
                </div>

                <div className="sell-success-row">
                    <span>Ngày bắt đầu:</span>
                    <span>{formatDate(member.start_date)}</span>
                </div>

                <div className="sell-success-row">
                    <span>Ngày hết hạn:</span>
                    <span>{formatDate(member.end_date)}</span>
                </div>

                <div className="sell-success-row">
                    <span>Số tiền:</span>
                    <span>{member.price.toLocaleString("vi-VN")}đ</span>
                </div>
                </div>

                <div className="sell-success-actions">
                    {
                        isNewPackage && (
                            <button
                                type="button"
                                className="sell-success-btn-primary"
                                onClick={handleCopy}
                            >
                                Copy tất cả
                            </button>
                        )
                    }

                    {
                        isNewPackage && (
                            <button
                                type="button"
                                className="sell-success-btn-secondary"
                                onClick={handlePrint}
                            >
                                In phiếu
                            </button>
                        )
                    }

                    <button
                        type="button"
                        className={isNewPackage ? "sell-success-btn-close" : "sell-success-btn-primary"}
                        onClick={()=>{

                            sessionStorage.removeItem(
                                "employee-sell-password"
                            );

                            navigate(

                                type==="employee-renew"
                                ? "/employee/renew-package"
                                : "/employee/sell-package"

                            );

                        }}
                    >
                        Quay lại
                    </button>
                </div>

            </div>

            {
                isNewPackage && (
                    <PrintMemberCard
                        member={member}
                        password={password}
                    />
                )
            }
        </div>

    );

}

export default EmployeeSuccess;
