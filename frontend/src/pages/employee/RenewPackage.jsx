import { useEffect, useState } from "react";

import SideBar from "../../components/SideBar";

import "../../styles/employee/RenewPackage.css";
import { getMemberRenewInfo, renewMemberPackage, renewMemberPackageQr } from "../../api/employee/RenewPackageApi";
import { toast } from "react-toastify";
import { formatDate } from "../../utils/date";
import { getPackages } from "../../api/packageApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import useDocumentTitle from "../../hooks/useDocumentTitle";
function RenewPackage() {
    useDocumentTitle("Gia hạn gói tập");
    const [searchParams]=useSearchParams();
    const memberFromUrl=searchParams.get("member");
    const [memberCode, setMemberCode] = useState(memberFromUrl||"");

    const [member, setMember] = useState(null);

    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [packages, setPackages] = useState([]);

    const [packageId, setPackageId] = useState("");

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [loading,setLoading]=useState(false);

    const navigate=useNavigate();
    

    

    async function handleSearch(code=memberCode){

        try{
    
            const data =
                await getMemberRenewInfo(
                    code
                );
    
            setMember(data);
            setPackageId("");
    
        }
    
        catch(error){
    
            toast.error(
    
                error.response?.data?.message
    
            );
    
        }
    
    }

    useEffect(()=>{
        if(memberFromUrl){
            handleSearch(memberFromUrl);
        }
    }, [memberFromUrl])

    async function handleRenew(){

        if(!member){
    
            return;
    
        }
    
        if(!packageId){
    
            toast.error("Chọn gói tập");
    
            return;
    
        }
    
        try{
    
            setLoading(true);
    
            const result=
    
                await renewMemberPackage({
    
                    memberId:member.id,
    
                    packageId
    
                });
    
            toast.success(result.message);
            await handleSearch();
            setPackageId("");
            setShowConfirmModal(false);
            setPaymentMethod("cash");
    
        }
    
        catch(error){
    
            toast.error(
    
                error.response?.data?.message
    
            );
    
        }
    
        finally{
    
            setLoading(false);
    
        }
    
    }
    useEffect(() => {

        async function loadPackages() {
    
            const data = await getPackages();
    
            setPackages(data);
    
        }
    
        loadPackages();
    
    }, []);

    const selectedPackage =
    packages.find(
        item => item.id === packageId

    );

    let newEndDate = null;

    if (member && selectedPackage) {

        const oldEnd =
            new Date(member.end_date);
    
        const today =
            new Date();
    
        let startDate;
    
        if (oldEnd > today) {
    
            startDate =
                new Date(oldEnd);
    
            startDate.setDate(
                startDate.getDate() + 1
            );
    
        }
    
        else {
    
            startDate =today;
    
        }
    
        newEndDate =
            new Date(startDate);
    
        newEndDate.setMonth(
    
            newEndDate.getMonth()
    
            +
    
            selectedPackage.duration_month
    
        );
    
    }

    
    return (

        <div className="employee-renew">

            <div className="employee-renew-sidebar">

                <SideBar />

            </div>

            <div className="employee-renew-content">

                <div className="employee-renew-header">

                    <h2>GIA HẠN GÓI TẬP</h2>

                </div>

                <div className="employee-renew-top">

                    <div className="employee-renew-form">

                        <h3>TÌM HỘI VIÊN</h3>

                        <div className="renew-search">

                            <input
                                placeholder="Nhập mã hội viên..."
                                value={memberCode}
                                onChange={(e) =>
                                    setMemberCode(e.target.value)
                                }
                            />

                            <button onClick={()=>handleSearch(memberCode)}>

                                Tìm

                            </button>

                        </div>

                        <hr />

                        <h3>CHỌN GÓI GIA HẠN</h3>

                        <select
                            value={packageId}
                            onChange={(e) =>
                                setPackageId(Number(e.target.value))
                            }
                        >

                            <option value="">

                                Chọn gói tập

                            </option>

                            {
                                packages.map(item =>

                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >

                                        {item.package_name}

                                    </option>

                                )
                            }

                        </select>
                        {
                            selectedPackage && (

                                <div className="employee-package-info">

                                    <p>

                                        Thời hạn:

                                        {" "}

                                        {selectedPackage.duration_month}

                                        tháng

                                    </p>

                                    <p>

                                        Giá:

                                        {" "}

                                        {selectedPackage.price.toLocaleString("vi-VN")}

                                        đ

                                    </p>

                                </div>

                            )
                        }

                        {
                            newEndDate &&

                            <div className="renew-result">

                                <span>

                                    Sau gia hạn

                                </span>

                                <strong>

                                    {formatDate(newEndDate)}

                                </strong>

                            </div>

                        }

                        <div className="employee-payment-method">

                            <label>

                                <input
                                    type="radio"
                                    checked={paymentMethod === "cash"}
                                    onChange={() =>
                                        setPaymentMethod("cash")
                                    }
                                />

                                Tiền mặt

                            </label>

                            <label>

                                <input
                                    type="radio"
                                    checked={paymentMethod === "bank"}
                                    onChange={() =>
                                        setPaymentMethod("bank")
                                    }
                                />

                                QR Chuyển khoản

                            </label>

                        </div>

                    </div>


                    <div className="employee-renew-preview">

                        <h3>THÔNG TIN HỘI VIÊN</h3>

                        <div className="employee-renew-avatar">

                            {
                                member ?

                                    <img
                                        src={`http://localhost:3000${member.verify_photo}`}
                                        alt=""
                                    />

                                    :

                                    <div className="employee-renew-empty">

                                        Chưa chọn hội viên

                                    </div>
                            }

                        </div>

                        <p>

                            <strong>Họ tên:</strong>

                            {
                                member
                                    ? member.fullname
                                    : "---"
                            }

                        </p>

                        <p>

                            <strong>Email:</strong>

                            {
                                member
                                    ? member.email
                                    : "---"
                            }

                        </p>

                        <p>

                            <strong>SĐT:</strong>

                            {
                                member
                                    ? member.phone
                                    : "---"
                            }

                        </p>

                        <p>

                            <strong>Gói hiện tại:</strong>

                            {
                                member
                                    ? member.package_name
                                    : "---"
                            }

                        </p>

                        <p>

                            <strong>Ngày hết hạn:</strong>

                            {
                                member
                                    ? formatDate(member.end_date)
                                    : "---"
                            }

                        </p>

                        <button

                            disabled={
                                !member ||
                                !packageId ||
                                loading
                            }

                            className="employee-renew-btn"

                            onClick={async() => {

                                if(paymentMethod==="cash"){

                                    setShowConfirmModal(true);

                                }

                                else{

                                    const result= await renewMemberPackageQr(member.id, packageId);
                                    navigate(`/checkout/${result.payment_id}?type=employee-renew`)

                                }

                            }}

                        >

                            Xác nhận gia hạn

                        </button>

                    </div>

                </div>

                <div className="employee-renew-history">

                    <h3>

                        LỊCH SỬ GIA HẠN

                    </h3>

                </div>

            </div>
            {
                showConfirmModal && (

                    <div className="employee-sell-confirm">

                        <div className="employee-sell-confirm-content">

                            <h3>

                                Xác nhận gia hạn

                            </h3>

                            <p>

                                Đã nhận

                                {

                                    selectedPackage.price.toLocaleString("vi-VN")

                                }

                                đ ?

                            </p>

                            <div className="employee-sell-confirm-btns">

                                <button
                                    disabled={
                                        !member ||
                                        !packageId ||
                                        loading
                                    }
                                    className="employee-sell-confirm-btn"
                                    onClick={async()=>{
                                        await handleRenew();
                                    }}
                                >

                                    Xác nhận

                                </button>

                                <button

                                    className="employee-sell-cancel-btn"

                                    onClick={()=>

                                        setShowConfirmModal(false)

                                    }

                                >

                                    Hủy

                                </button>

                            </div>

                        </div>

                    </div>

                )
            }
        </div>

    );

}

export default RenewPackage;