import { useContext, useEffect, useState } from "react";
import SideBar from "../../components/SideBar";
import "../../styles/Style.css";
import { AuthContext } from "../../contexts/AuthContext";
import { getMyPackage } from "../../api/packageApi";
import "../../styles/member/HomeMember.css";
import { FaHandsWash } from "react-icons/fa";
import avatar from "../../assets/users/avatar1.jpg";
import { getCountCheckinThisMonth } from "../../api/CheckinApi";
import { getCountServiceMember, getMemberService } from "../../api/ServiceApi";
import { getCompletedSessions, getCountPTActive } from "../../api/TrainerApi";
import { getTodaySchedule } from "../../api/ScheduleApi";
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/date";
import { getServiceStatusBadge } from "../../utils/statusBadge";
import useDocumentTitle from "../../hooks/useDocumentTitle";

function HomeMember(){

    useDocumentTitle("Trang chủ");
    const [mypackage, setMypackage]=useState(null);
    const {user}=useContext(AuthContext);
    const [checkinCount, setCheckinCount]=useState(0);
    const [serviceCount, setServiceCount]=useState(0);
    const [trainerCount, setTrainerCount]=useState(0);

    const [usedSessions, setUsedSessions]=useState(0);

    const [todaySchedules, setTodaySchedules]=useState([]);

    const [memberServices, setMemberServices]=useState([]);

    useEffect(()=>{
        async function loadMypackage(){
            const data=await getMyPackage();
            setMypackage(data);
        }
        loadMypackage();
    },[user]);
    
    const activePackage=mypackage?.activePackage;

    useEffect(()=>{
        if(!user?.member?.id){
            return;
        }

        async function loadCheckinCount(){
            const count=await getCountCheckinThisMonth();
            console.log("COuNT=", count);
            setCheckinCount(count);
        }
        loadCheckinCount();
    },[user]);

    useEffect(()=>{
        if(!user?.member?.id){
            return;
        }
        async function loadServiceCount(){
            const count=await getCountServiceMember();
            setServiceCount(count);
        }
        loadServiceCount();
    },[user]);

    useEffect(()=>{
        if(!user?.member?.id){
            return;
        }
        async function loadTrainerCount(){
            const count=await getCountPTActive();
            setTrainerCount(count);
        }
        loadTrainerCount();
    },[user])

    useEffect(()=>{
        async function loadUsedSessions(){
            const useSession=await getCompletedSessions();

            setUsedSessions(useSession);
        }
        loadUsedSessions();
    },[user]);

    useEffect(()=>{
        async function loadTodaySchedule() {
            const data=await getTodaySchedule();
            setTodaySchedules(data);
        }
        loadTodaySchedule();
    },[user]);
    
    useEffect(()=>{
        async function loadMemberService(){
            const data=await getMemberService();
            setMemberServices(data);
        }
        loadMemberService();
    },[user]);
  

    return(
        <div className="member-home">
            <div className="member-home-sidebar">
                <SideBar/>
            </div>
            <div className="member-home-content">
                <div className="member-home-header">
                    <h1>TRANG CHỦ HỘI VIÊN</h1>
                </div>
                <div className="member-home-overview">
                    <div className="member-home-profile-qr">
                        <div className="member-home-profile">
                            <div className="member-home-avatar-name">
                                <div className="member-home-avatar">
                                    {
                                        user&&<img src={user?.avatar?`http://localhost:3000${user?.avatar}`: avatar} alt="" className="member-home-avatar-img"/>
                                    }
                                        
                                </div>
                                
                                <div className="member-home-name">
                                    <h3>Xin chào, {user?.fullname}  <FaHandsWash className="icon-hand"/></h3>
                                    <p>Chúc bạn một ngày tập hiệu quả!</p>
                                </div>
                            </div>
                            <div className="member-home-info">
                                <div className="member-home-info-item">
                                    <p>Mã hội viên:   <strong>{user?.member?.member_code}</strong></p>
                                    <p>Ngày hết hạn:    <strong>{formatDate(activePackage?.end_date)}</strong></p>
                                </div>
                                <div className="member-home-info-item">
                                    <p>Ngày bắt đầu:   <strong>{formatDate(activePackage?.start_date)}</strong></p>
                                    <p>Còn lại:    <strong>{activePackage?.remaining_days} ngày</strong></p>
                                </div>
                            </div>
                        </div>
                        <div className="member-home-qr">
                            <p>QR CHECK-IN</p>
                            <QRCode value={user.member.member_code} size={150}/>
                            <Link to="/member/checkin"><button className="checkin-link">Check-in ngay</button></Link>
                        </div>
                    </div>
                    <div className="member-home-statis">
                        <div className="member-home-statis-item">
                            <h2>{checkinCount}</h2>
                            <p>Lần checkin <br /> tháng này</p>
                        </div>
                        <div className="member-home-statis-item">
                            <h2>{serviceCount}</h2>
                            <p>Dịch vụ <br /> đã đăng ký</p>
                        </div>
                        <div className="member-home-statis-item">
                            <h2>{trainerCount}</h2>
                            <p>Huấn luyện viên <br /> đang theo</p>
                        </div>
                        <div className="member-home-statis-item">
                            <h2>{usedSessions}</h2>
                            <p>Buổi tập <br /> đã hoàn thành</p>
                        </div>
                    </div>
                </div>
                <div className="member-home-footer">
                    <div className="member-home-schedule">
                        <h2>LỊCH TẬP HÔM NAY</h2>
                        <div className="member-home-schedule-box">
                            {todaySchedules.length===0?(
                                <p>Không có lịch tập hôm nay</p>
                            )
                            :
                            (todaySchedules.map(schedule=>(
                                <div className="member-home-schedule-detail" key={schedule.id}>
                                    <p>Thời gian:  <strong>{schedule.schedule_time.slice(0,5)}</strong></p>
                                    <p>PT {schedule.trainer_name}</p>
                                    <p>Chuyên môn {schedule.specialty}</p>

                                </div>
                            )))}
                        </div>
                    </div>
                    <div className="member-home-service-history">
                        <h2>DỊCH VỤ ĐANG SỬ DỤNG</h2>
                        {
                            memberServices.map(ms=>(
                                <div className="member-home-service-item" key={ms.id}>
                                    <h4>{ms.service_name}</h4>
                                    <span className={getServiceStatusBadge(ms.status)}>
                                        {ms.status === "pending"
                                            ? "Đang sử dụng"
                                            : ms.status === "using"
                                            ? "Chờ xác nhận"
                                            : "Đã sử dụng"}
                                    </span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
        
    )
}
export default HomeMember;