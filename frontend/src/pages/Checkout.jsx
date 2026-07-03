import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getPaymentById } from "../api/PaymentApi";
import { getCheckoutStatusBadge } from "../utils/statusBadge";
import "../styles/Checkout.css";
import useDocumentTitle from "../hooks/useDocumentTitle";

function Checkout() {
    useDocumentTitle("Thanh toán");
    const { paymentId } = useParams();
    const navigate=useNavigate();
    const [payment, setPayment] = useState(null);

    const [searchParams]=useSearchParams();

    const type=searchParams.get("type");
    
    useEffect(() => {

        async function checkPayment() {
    
            const data =
                await getPaymentById(paymentId);
    
            setPayment(data);
    
            if(data.status === "paid") {
                if(type==="employee-package") {
                    navigate(`/employee/payment-success/${paymentId}?type=${type}`);
                }
                else if(type==="renew-package"){
                    navigate(`/payment-success?type=${type}`);
                }
                else if(type==="employee-renew"){
                    navigate(`/employee/payment-success/${paymentId}?type=${type}`);
                }
                else{
                    navigate(`/payment-success?type=${type}`);
                }
                
            }
        }
    
        checkPayment();
    
        const interval =
            setInterval(checkPayment, 3000);
    
        return () =>
            clearInterval(interval);
    
    }, [paymentId, navigate]);
    if (!payment) {
        return (
            <div className="checkout checkout--loading">
                <div className="checkout-loading">Loading...</div>
            </div>
        );
    }

    const qrUrl= `https://img.vietqr.io/image/970422-0334153621-compact2.png`+`?amount=${payment.price}`
                + `&addInfo=${payment.transfer_content}`+`&accountName=NGUYEN THANH LOI`;

    console.log(qrUrl);
    return (

        <div className="checkout">

            <div className="checkout-box">

            <h1>Thanh toán</h1>

            <div className="checkout-info">

            <p>
                Số tiền:
                <span className="checkout-amount">
                {payment.price.toLocaleString()}
                đ
                </span>
            </p>

            <p>
                Nội dung CK:
                <span>{payment.transfer_content}</span>
            </p>

            <p>
                Trạng thái:
                <span className={getCheckoutStatusBadge(payment.status)}>
                {payment.status==="pending"?"Chờ thanh toán":"Đã thanh toán"}
                </span>
            </p>

            </div>

            <div className="checkout-qr">
                <img src={qrUrl} alt="QR THANH TOÁN" />
            </div>

            <p className="checkout-hint">
                Quét mã QR để thanh toán. Hệ thống sẽ tự động xác nhận khi giao dịch thành công.
            </p>

            </div>
        </div>

    );
}

export default Checkout;