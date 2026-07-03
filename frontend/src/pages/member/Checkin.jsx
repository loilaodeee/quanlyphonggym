import QRCode from "react-qr-code";
import checkins from "../../mockApi/checkin";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import "../../styles/member/Checkin.css";
import SideBar from "../../components/SideBar";
import "../../styles/Style.css";
import { getCheckinHistory } from "../../api/CheckinApi";
import { formatDate, formatTime } from "../../utils/date";
import useDocumentTitle from "../../hooks/useDocumentTitle";
function CheckIn(){

    useDocumentTitle("Check-in");
    const {user}=useContext(AuthContext);
    const [showQrModal, setShowQrModal]=useState(false);
    const [checkInHistory, setCheckinHistory]=useState([]);

    useEffect(()=>{
        async function loadCheckinHistory(){
            const data= await getCheckinHistory();
            setCheckinHistory(data);
        }
        loadCheckinHistory();
    },[user]);
    return(
        <div className="member-checkin">
            <div className="member-checkin-sidebar">
                <SideBar/>
            </div>
            <div className="member-checkin-content">
                <div className="member-checkin-header">
                    <h2>CHECK-IN</h2>
                </div>

                <div className="member-checkin-top">

                    <div className="member-checkin-qr">

                        <h3>QR CHECK-IN</h3>

                        <p>Quét mã dưới đây tại quầy check-in</p>

                        <div
                            className="member-checkin-qr-image"
                            onClick={()=>setShowQrModal(true)}
                            >
                            <QRCode
                                value={user.member.member_code}
                                size={250}
                                className="member-checkin-qrcode"
                            />
                        </div>


                    </div>

                    <div className="member-checkin-guide">

                        <h3>HƯỚNG DẪN CHECK-IN</h3>

                        <div className="guide-item">
                            <div className="guide-number">1</div>
                            <div>
                                <h4>Đến quầy lễ tân</h4>
                                <p>Xuất trình mã QR của bạn.</p>
                            </div>
                        </div>

                        <div className="guide-item">
                            <div className="guide-number">2</div>
                            <div>
                                <h4>Quét mã</h4>
                                <p>Nhân viên sẽ quét mã để check-in.</p>
                            </div>
                        </div>

                        <div className="guide-item">
                            <div className="guide-number">3</div>
                            <div>
                                <h4>Bắt đầu tập luyện</h4>
                                <p>Chúc bạn có một buổi tập hiệu quả.</p>
                            </div>
                        </div>

                    </div>

                </div>

                <div className="member-checkin-history">

                    <h3>LỊCH SỬ CHECK-IN GẦN ĐÂY</h3>

                    <div className="member-checkin-table">

                        <table>

                            <thead>

                                <tr>

                                    <th>Ngày</th>

                                    <th>Giờ</th>

                                    <th>Trạng thái</th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    checkInHistory.map((item)=>(

                                        <tr key={item.id}>

                                            <td>{formatDate(item.checkin_time)}</td>

                                            <td>{formatTime(item.checkin_time)}</td>

                                            <td>

                                                <span className="success">

                                                    Check-in thành công

                                                </span>

                                            </td>

                                        </tr>

                                    ))

                                }

                            </tbody>

                        </table>

                    </div>

                </div>
            </div>
            
            {
                showQrModal && (
                    <div
                        className="qr-modal-overlay"
                        onClick={() => setShowQrModal(false)}
                    >
                        <div
                            className="qr-modal"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <h3>QR CHECK-IN</h3>

                            <QRCode
                                value={user.member.member_code}
                                size={400}
                            />

                            <p>{user.member.member_code}</p>

                            <button
                                onClick={() => setShowQrModal(false)}
                            >
                                Đóng
                            </button>

                        </div>
                    </div>
                )
            }      
        </div>
    )
}

export default CheckIn;
