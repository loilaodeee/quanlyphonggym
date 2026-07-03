import { useEffect, useState } from "react";
import { getTrainerDashboard } from "../../api/trainer/TrainerApi";
import SideBar from "../../components/SideBar";
import "../../styles/trainer/TrainerDashboard.css";
import { FaCalendarDay, FaCircleCheck, FaClock, FaUsers } from "react-icons/fa6";
import { getScheduleStatusBadge } from "../../utils/statusBadge";
import useDocumentTitle from "../../hooks/useDocumentTitle";

function TrainerDashboard(){
    useDocumentTitle("Trang chủ");
    const [dashboard,setDashboard]=useState(null);

    useEffect(()=>{

        async function load(){
    
            const data=
                await getTrainerDashboard();
    
            setDashboard(data);
    
        }
    
        load();
    
    },[]);

    function getStatusLabel(status){
        if(status==="completed"){
            return "Đã hoàn thành";
        }
        if(status==="canceled"){
            return "Đã hủy";
        }
        return "Chờ tập";
    }

    if(!dashboard){
        return (
            <div className="trainer-dashboard">
                <div className="trainer-dashboard-sidebar">
                    <SideBar/>
                </div>
                <div className="trainer-dashboard-content">
                    <p style={{color: "var(--gym-text-muted)"}}>Đang tải...</p>
                </div>
            </div>
        );
    }

    return (

        <div className="trainer-dashboard">
        
            <div className="trainer-dashboard-sidebar">
                <SideBar/>
            </div>
        
            <div className="trainer-dashboard-content">
        
                <h2>TRANG CHỦ</h2>
                <span className="trainer-dashboard-date">
                    {new Date().toLocaleDateString("vi-VN")}
                </span>
        
                <div className="trainer-dashboard-cards">
        
                    <div className="trainer-dashboard-card today">
                        <div className="trainer-dashboard-icon">
                            <FaCalendarDay/>
                        </div>
                        <div>
                            <p>Lịch hôm nay</p>
                            <h2>{dashboard.todaySchedules}</h2>
                        </div>
                    </div>
        
                    <div className="trainer-dashboard-card card-completed">
                        <div className="trainer-dashboard-icon">
                            <FaCircleCheck/>
                        </div>
                        <div>
                            <p>Đã hoàn thành</p>
                            <h2>{dashboard.completedSchedules}</h2>
                        </div>
                    </div>
        
                    <div className="trainer-dashboard-card members">
                        <div className="trainer-dashboard-icon">
                            <FaUsers/>
                        </div>
                        <div>
                            <p>Hội viên PT</p>
                            <h2>{dashboard.activeMembers}</h2>
                        </div>
                    </div>
        
                    <div className="trainer-dashboard-card card-booked">
                        <div className="trainer-dashboard-icon">
                            <FaClock/>
                        </div>
                        <div>
                            <p>Chờ tập</p>
                            <h2>{dashboard.bookedSchedules}</h2>
                        </div>
                    </div>
        
                </div>
        
                <div className="trainer-dashboard-schedule">
        
                    <h3>LỊCH HÔM NAY</h3>
        
                    <table>
        
                        <thead>
        
                            <tr>
        
                                <th>Giờ</th>
        
                                <th>Mã HV</th>
        
                                <th>Họ tên</th>
        
                                <th>Trạng thái</th>
        
                            </tr>
        
                        </thead>
        
                        <tbody>
        
                        {
        
                            dashboard.schedules.length===0 ?
        
                            <tr>
        
                                <td colSpan={4} className="trainer-empty">
        
                                    Hôm nay chưa có lịch.
        
                                </td>
        
                            </tr>
        
                            :
        
                            dashboard.schedules.map(item=>(
        
                                <tr key={item.id}>
        
                                    <td>
        
                                        {item.schedule_time?.slice(0, 5) || item.schedule_time}
        
                                    </td>
        
                                    <td>
        
                                        {item.member_code}
        
                                    </td>
        
                                    <td>
        
                                        {item.fullname}
        
                                    </td>
        
                                    <td>
        
                                        <span className={getScheduleStatusBadge(item.status || "booked")}>
                                            {getStatusLabel(item.status)}
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
        
        );
}

export default TrainerDashboard;
