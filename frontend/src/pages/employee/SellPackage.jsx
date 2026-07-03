import { useRef, useState } from "react";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { createPackageQr, getPackageSellHistory, sellPackage } from "../../api/employee/SellPackageApi";
import { getPackages } from "../../api/packageApi";
import SideBar from "../../components/SideBar";
import "../../styles/employee/SellPackage.css";
import "../../styles/employee/EmployeeSuccess.css";
import "../../styles/employee/PrintMemberCard.css";
import QRCode from "react-qr-code";
import PrintMemberCard from "../../components/PrintMemberCard";
import { useNavigate } from "react-router-dom";
import { formatDate, formatDateTime } from "../../utils/date";
import useDocumentTitle from "../../hooks/useDocumentTitle";

function SellPackage(){
    useDocumentTitle("Bán gói tập");

    const [fullname, setFullname]=useState("");
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const [phone, setPhone]=useState("");
    const [packageId, setPackageId]=useState("");
    const [packages, setPackages]=useState([]);
    const [verifyPhoto, setVerifyPhoto]=useState(null);
    const [verifyPhotoPreview, setVerifyPhotoPreview]=useState(null);

    const [history, setHistory]=useState([]);
    const [loading, setLoading]=useState(false);

    const [showConfirmModal, setShowConfirmModal]=useState(false);
    const [showSuccessModal, setShowSuccessModal]=useState(false);
    const [memberInfo, setMemberInfo]=useState(null);

    const [paymentMethod, setPaymentMethod] = useState("cash");

    const [showQrModal, setShowQrModal] = useState(false);

    const [paymentInfo, setPaymentInfo] = useState(null);

    const [keyword,setKeyword]=useState("");

    const [filterMethod,setFilterMethod]=useState("all");

    const navigate=useNavigate();



    async function loadHistory(){
        const data=await getPackageSellHistory(keyword, filterMethod);
        setHistory(data);
    }

    useEffect(()=>{
        async function load(){
            const data= await getPackages();
            setPackages(data);
            await loadHistory();
        }
        load();
    },[])   

    useEffect(() => {

        const timer = setTimeout(() => {
    
            loadHistory();
    
        },300);
    
        return ()=>clearTimeout(timer);
    
    },[keyword,filterMethod]);

    const selectedPackage=packages.find(p=>p.id===packageId);

    const fileRef=useRef(null);

    async function handleSellPackage(){
        if(!fullname || !email || !password || !phone || !packageId || !verifyPhoto){
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }
        setLoading(true);
        try {
            const result=await sellPackage({
                email, password, fullname, phone, packageId, photo: verifyPhoto
            });
            toast.success(result.message);

            setMemberInfo(result.member);
            setShowSuccessModal(true);

            setFullname("");
            setEmail("");
            setPassword("");
            setPhone("");
            setPackageId("");
            fileRef.current.value="";
            setVerifyPhoto(null);
            setVerifyPhotoPreview(null);
            setShowConfirmModal(false);

            await loadHistory();

        } catch (error) {
            toast.error(error.response?.data?.message)
        }
        finally{
            setLoading(false);
        }

    }

    async function handleCopy(){
        await navigator.clipboard.writeText(
            `Mã hội viên: ${memberInfo.member_code}
Email: ${memberInfo.email}
Mật khẩu: ${memberInfo.password}
Gói tập: ${memberInfo.package_name}
Ngày hết hạn: ${formatDate(memberInfo.end_date)}
`
        );
        toast.success("Đã copy thông tin hội viên");
    }

    async function handleCreateQr(){

        try {
            sessionStorage.setItem("employee-sell-password", password);
            const result=await createPackageQr({
                email, password, phone, fullname, packageId, photo: verifyPhoto
            });

            setFullname("");
            setEmail("");
            setPassword("");
            setPhone("");
            setPackageId("");
            fileRef.current.value="";

            navigate(`/checkout/${result.payment_id}?type=employee-package`);

            
        } catch (error) {
            toast.error(error.response?.data?.message)
            
        }
        
    }

    function handlePrint(){
        window.print();
    }

    const qrValue=memberInfo ? `http://localhost:5174/login?member=${memberInfo.member_code}`:"";

     

    return(
        <div className="employee-sell">

        <div className="employee-sell-sidebar">
            <SideBar />
        </div>


        <div className="employee-sell-content">

            <div className="employee-sell-header">
                <h2>BÁN GÓI TẬP</h2>
            </div>

            <div className="employee-sell-top">

                <div className="employee-sell-form">
                    <h3>THÔNG TIN KHÁCH HÀNG</h3>

                    <input placeholder="Họ tên" value={fullname} onChange={(e)=>setFullname(e.target.value)} />

                    <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />

                    <input placeholder="Số điện thoại" value={phone} onChange={(e)=>setPhone(e.target.value)} />

                    <input placeholder="Mật khẩu" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>

                    <select value={packageId} onChange={(e)=>setPackageId(Number(e.target.value))}>
                        <option value="">Chọn gói tập</option>
                        {
                            packages.map(p=>
                                <option key={p.id} value={p.id}>{p.package_name}</option>
                            )
                        }
                        
                    </select>
                    {
                            selectedPackage && (

                                <div className="employee-package-info">

                                    <p>

                                        Thời hạn:

                                        {" "}

                                        {selectedPackage.duration_month} tháng

                                    </p>

                                    <p>

                                        Giá:

                                        {" "}

                                        {selectedPackage.price.toLocaleString()} đ

                                    </p>

                                </div>

                            )
                        }
                        <div className="employee-payment-method">

                        <label>

                            <input
                                type="radio"
                                checked={paymentMethod==="cash"}
                                onChange={()=>setPaymentMethod("cash")}
                            />

                            Tiền mặt

                        </label>

                        <label>

                            <input
                                type="radio"
                                checked={paymentMethod==="bank"}
                                onChange={()=>setPaymentMethod("bank")}
                            />

                            QR Chuyển khoản

                        </label>

                        </div>

                    <label
                        htmlFor="verify-upload"
                        className="btn-upload"
                    >

                        Chọn ảnh hội viên

                    </label>
                    <input
                        ref={fileRef}
                        type="file" accept="image/*"
                        id="verify-upload"
                        hidden
                        onChange={(e)=>{
                            const file=e.target.files[0];
                            if(!file){
                                return;
                            }
                            setVerifyPhoto(file);
                            setVerifyPhotoPreview(URL.createObjectURL(file))
                        }}
                    />

                </div>

                <div className="employee-sell-preview">
                <h3>XÁC NHẬN ĐƠN BÁN</h3>
                     {
                        verifyPhotoPreview ? <img src={verifyPhotoPreview} className="employee-sell-avatar" alt="" /> :
                        <div className="employee-sell-empty">
                            Chưa có ảnh

                        </div>
                     }   
                <h3>{fullname||"Chưa nhập tên"}</h3>
                <p>
                    Email: {email || "Chưa nhập email"}
                </p>
                <p>

                    SĐT: {phone || "Chưa nhập SĐT"}

                </p>
                    
                <p>

                    Gói tập:

                    {" "}

                    {selectedPackage?.package_name || "---"}

                    </p>

                    <p>

                    Giá:

                    {" "}

                    {
                        selectedPackage
                        ?

                        selectedPackage?.price.toLocaleString()

                        :

                        "---"
                    }

                    đ

                    </p>

                    <p>

                    Thanh toán:

                    {
                        paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản QR"
                    }

                    </p>
                    <button
                        className="employee-sell-btn"
                        onClick={()=>{
                            if(paymentMethod==="cash"){
                                setShowConfirmModal(true);
                            }
                            else{
                                handleCreateQr();
                            }
                        }}
                    >
                        Xác nhận bán
                    </button>
                </div>

            </div>

            <div className="employee-sell-history">
                <h3>LỊCH SỬ BÁN GÓI</h3>
                <div className="sell-history-toolbar">

                <input

                    placeholder="Tìm tên hội viên"

                    value={keyword}

                    onChange={(e)=>
                        setKeyword(e.target.value)
                    }

                />

                <select

                    value={filterMethod}

                    onChange={(e)=>
                        setFilterMethod(
                            e.target.value
                        )
                    }

                >

                    <option value="all">

                        Tất cả

                    </option>

                    <option value="cash">

                        Tiền mặt

                    </option>

                    <option value="bank">

                        QR

                    </option>

                </select>

            </div>
            <div className="sell-history-wrapper">
                <table className="sell-history-table">

                    <thead>

                        <tr>

                            <th>Thời gian</th>

                            <th>Hội viên</th>

                            <th>Gói tập</th>

                            <th>Thanh toán</th>

                            <th>Số tiền</th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            history.map(item=>

                                <tr key={item.id}>

                                    <td>

                                        {formatDateTime(item.created_at)}

                                    </td>

                                    <td>{item.fullname}</td>

                                    <td>{item.package_name}</td>

                                    <td>

                                        {
                                            item.payment_method==="cash"
                                            ? "Tiền mặt"
                                            : "QR"
                                        }

                                    </td>

                                    <td>

                                        {item.price.toLocaleString("vi-VN")}đ

                                    </td>

                                </tr>

                            )
                        }

                    </tbody>

                </table>
            </div>
                       
            </div>

        </div>
        {
            showConfirmModal&& (
                
                <div className="employee-sell-confirm">
                    <div className="employee-sell-confirm-content">
                        <h3>Xác nhận bán gói tập</h3>
                        <p>Xác nhận đã nhận đủ: {selectedPackage?.price.toLocaleString("vi-VN")}đ tiền mặt từ khách</p>
                        <div className="employee-sell-confirm-btns">
                            <button
                                className="employee-sell-confirm-btn"
                                onClick={()=>{
                                    setShowConfirmModal(false);
                                    handleSellPackage();
                                }}
                            >
                                Xác nhận
                            </button>
                            <button
                                className="employee-sell-cancel-btn"
                                onClick={()=>setShowConfirmModal(false)}
                            >
                                Hủy bỏ
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

        {
            showSuccessModal && memberInfo && (

                <div className="sell-success-overlay">

                    <div className="sell-success-card">

                        <h2>Đăng ký thành công</h2>

                        <div className="sell-success-qr">
                            <QRCode value={qrValue} size={180}/>
                        </div>

                        <p className="sell-success-qr-hint">
                            Quét QR để mở nhanh trang đăng nhập
                        </p>

                        <div className="sell-success-rows">
                        <div className="sell-success-row">
                            <span>Họ tên:</span>
                            <span>{memberInfo.fullname}</span>
                        </div>

                        <div className="sell-success-row">
                            <span>Mã hội viên:</span>
                            <span>{memberInfo.member_code}</span>
                        </div>

                        <div className="sell-success-row">
                            <span>Email:</span>
                            <span>{memberInfo.email}</span>
                        </div>

                        <div className="sell-success-row">
                            <span>SĐT:</span>
                            <span>{memberInfo.phone}</span>
                        </div>

                        <div className="sell-success-row">
                            <span>Mật khẩu:</span>
                            <span>{memberInfo.password}</span>
                        </div>

                        <div className="sell-success-row">
                            <span>Gói tập:</span>
                            <span>{memberInfo.package_name}</span>
                        </div>

                        <div className="sell-success-row">
                            <span>Ngày bắt đầu:</span>
                            <span>{formatDate(memberInfo.start_date)}</span>
                        </div>

                        <div className="sell-success-row">
                            <span>Ngày hết hạn:</span>
                            <span>{formatDate(memberInfo.end_date)}</span>
                        </div>

                        <div className="sell-success-row">
                            <span>Số tiền:</span>
                            <span>{memberInfo.amount.toLocaleString("vi-VN")}đ</span>
                        </div>
                        </div>

                        <div className="sell-success-actions">
                            <button
                                type="button"
                                className="sell-success-btn-primary"
                                onClick={handleCopy}
                            >
                                Copy tất cả
                            </button>
                            <button
                                type="button"
                                className="sell-success-btn-secondary"
                                onClick={handlePrint}
                            >
                                In phiếu
                            </button>
                            <button
                                type="button"
                                className="sell-success-btn-close"
                                onClick={() => setShowSuccessModal(false)}
                            >
                                Đóng
                            </button>
                        </div>

                    </div>

                    <PrintMemberCard
                        member={{
                            ...memberInfo,
                            price: memberInfo.amount
                        }}
                        password={memberInfo.password}
                    />

                </div>

            )
        }
    </div>
    )
}

export default SellPackage;