import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { checkInMember, getMemberByCode, getRecentCheckins } from "../../api/employee/CheckinApi";

import "../../styles/employee/Checkin.css";
import SideBar from "../../components/SideBar";
import { formatTime } from "../../utils/date";
import { getAccountStatusBadge } from "../../utils/statusBadge";
import {Html5Qrcode, Html5QrcodeScanner} from "html5-qrcode"
import useDocumentTitle from "../../hooks/useDocumentTitle";

function Checkin(){
    useDocumentTitle("Check-in");
    const [memberCode, setMemberCode] = useState("");

    const [member, setMember] = useState(null);

    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    const [showScanner, setShowScanner] = useState(false);

    const scannerRef=useRef();

    const [showPhotoModal, setShowPhotoModal] = useState(false);

    useEffect(()=>{
        if(!showScanner){
            return
        };

        async function startScanner(){
            const scanner= new Html5Qrcode("reader");

            scannerRef.current=scanner;

            await scanner.start(
                {
                    facingMode: "environment"
                },
                {
                    fps: 20,
                    qrbox:{
                        width: 300,
                        height: 300
                    }
                },
                
                async(decodeText)=>{
                    try {
                        const data= await getMemberByCode(decodeText);

                        await scanner.stop();
                        await scanner.clear();
                        scannerRef.current=null;
                        setMember(data);
                        setMemberCode(decodeText);
                       
                        setShowScanner(false);

                        toast.success("Quét QR thành công");
                    } catch {
                        toast.error("Không tìm thấy hội viên");
                    }
                }
            );
            return async()=>{
                try {
                    await scanner.stop();
                    await scanner.clear();
                } catch(error) {
                    toast.error(error);
                }
            };
        }
        
        startScanner();
        
    },[showScanner]);

    useEffect(()=>{

        async function loadHistory(){
    
            const data =
                await getRecentCheckins();
    
            setHistory(data);
        }
    
        loadHistory();
    
    },[]);

    async function handleSearch(){
        if(!memberCode.trim()){
            toast.error("Vui lòng nhập mã hội viên");
            return;
        }
        try{  
            setLoading(true);  
            const data =
                await getMemberByCode(
                    memberCode
                );   
            setMember(data); 

            
        }
        catch(error){  
            setMember(null);  
            toast.error(
                error.response?.data?.message
                || "Không tìm thấy hội viên"
            );
        }
        finally{
    
            setLoading(false);
        }
    }

    async function handleCheckin(){
        try{    
            const result =
                await checkInMember(
                    member.id,
                    member.member_code
                ); 
            const recentCheckin= await getRecentCheckins();
            setHistory(recentCheckin);
            toast.success(
                result.message
            );
            setMember(null);
            setMemberCode(""); 
            
        }
        catch(error){
            toast.error(
                error.response?.data?.message
            );
        }
    }
    return(
        <div className="employee-checkin">

        <div className="employee-checkin-sidebar">
            <SideBar />
        </div>

        <div className="employee-checkin-content">

            <div className="employee-checkin-header">
                <h2>CHECK-IN HỘI VIÊN</h2>
            </div>

            <div className="employee-checkin-top">

                <div className="employee-checkin-search">
                <h3>TÌM HỘI VIÊN</h3>

                <input
                    type="text"
                    placeholder="Nhập mã hội viên"
                    value={memberCode}
                    onChange={(e)=>
                        setMemberCode(e.target.value)
                    }
                />

                <button onClick={handleSearch}>
                    Tìm kiếm
                </button>
                <button
                    onClick={() =>
                        setShowScanner(true)
                    }
                >
                    Quét QR
                </button>
        
                </div>

                <div className="employee-checkin-member">
                <h3>THÔNG TIN HỘI VIÊN</h3>

                {
                    member ? (

                        <>

                            <img
                                src={
                                    member.verify_photo
                                    ? `http://localhost:3000${member.verify_photo}`
                                    : "/default-avatar.png"
                                }
                                className="employee-member-avatar"
                                onClick={() => setShowPhotoModal(true)}
                            />

                            <p className="photo-tip">

                            📷 Nhấn vào ảnh để xem rõ hơn

                            </p>

                            <h3>
                                {member.fullname}
                            </h3>

                            <p>
                                Mã HV:
                                {" "}
                                {member.member_code}
                            </p>

                            <p>
                                SĐT:
                                {" "}
                                {member.phone}
                            </p>

                            <p>
                                {
                                    member.status === "active"
                                    ?
                                    <span className={getAccountStatusBadge(true)}>Đang hoạt động</span>
                                    :
                                    <span className={getAccountStatusBadge(false)}>Ngừng hoạt động</span>
                                }
                            </p>

                            <button
                                className="employee-checkin-btn"
                                onClick={handleCheckin}
                            >
                                Xác nhận Check-in
                            </button>

                        </>

                    ) : (

                        <p>
                            Chưa chọn hội viên
                        </p>

                    )
                }

                </div>

            </div>

            <div className="employee-checkin-history">
            <h3>
                LỊCH SỬ CHECK-IN GẦN ĐÂY
            </h3>

            {
                history.map(item => (

                    <div
                        className="employee-history-item"
                        key={item.id}
                    >

                        <span>
                            {formatTime(item.checkin_time)}
                        </span>

                        <span>
                            {item.member_code}
                        </span>

                        <span>
                            {item.fullname}
                        </span>

                    </div>

                ))
            }


            </div>

        </div>
        {
            showScanner && (

                <div
                    className="qr-modal-overlay-employee"
                    onClick={ async()=>{
                        if(scannerRef.current){
                            try {
                                await scannerRef.current.stop();
                                await scannerRef.current.clear();
                                scannerRef.current=null;
                                setShowScanner(false);
                            } catch(error) {
                                toast.error(error);
                            }
                        }
                    }
                    }
                >

                    <div
                        className="qr-modal-employee"
                        onClick={(e)=>
                            e.stopPropagation()
                        }
                    >

                        <h3>
                            Quét QR hội viên
                        </h3>

                        <div id="reader"></div>

                        <button
                            onClick={ async ()=>{
                                if(scannerRef.current){
                                    try {
                                        await scannerRef.current.stop();
                                        await scannerRef.current.clear();
                                        scannerRef.current=null
                                        setShowScanner(false);
                                    } catch(error)  {
                                        toast.error(error);
                                    }
                                }
                            }
                            }
                        >
                            Đóng
                        </button>

                    </div>

                </div>

            )
        }

        {
            showPhotoModal &&

            <div
                className="photo-modal-overlay"
                onClick={() => setShowPhotoModal(false)}
            >

                <div
                    className="photo-modal"
                    onClick={(e)=>e.stopPropagation()}
                >

                    <h3>ẢNH XÁC MINH HỘI VIÊN</h3>

                    <img
                        src={`http://localhost:3000${member.verify_photo}`}
                        className="photo-modal-image"
                    />

                    <button
                        onClick={()=>setShowPhotoModal(false)}
                    >
                        Đóng
                    </button>

                </div>

            </div>
        }
    </div>
    
    )
}

export default Checkin;