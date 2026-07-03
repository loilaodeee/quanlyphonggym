import { useEffect, useState } from "react";
import { getDashboard, getPendingServices } from "../../api/employee/DashboardApi";
import { getRecentCheckins } from "../../api/employee/CheckinApi";
import { formatDate, formatDateTime } from "../../utils/date";
import SideBar from "../../components/SideBar";
import { FaClipboardCheck, FaMoneyBillWave, FaUsers } from "react-icons/fa6";
import { FaConciergeBell } from "react-icons/fa";

import "../../styles/employee/Dashboard.css";
import useDocumentTitle from "../../hooks/useDocumentTitle";

function Dashboard(){
    useDocumentTitle("Trang chủ");

    const [dashboard,setDashboard]=useState(null);

    const [checkins,setCheckins]=useState([]);

    const [services,setServices]=useState([]);

    async function load(){

        setDashboard(await getDashboard());
    
        setCheckins(await getRecentCheckins());
    
        setServices(await getPendingServices());
    
    }
    
    useEffect(()=>{
    
        load();
    
    },[]);

    if(!dashboard){

        return (
            <div className="employee-dashboard">
                <div className="dashboard-sidebar"><SideBar/></div>
                <div className="dashboard-content">
                    <p style={{color: "var(--gym-text-muted)"}}>Đang tải...</p>
                </div>
            </div>
        );
    
    }

    return(

        <div className="employee-dashboard">
        
            <div className="dashboard-sidebar">
        
                <SideBar/>
        
            </div>
        
            <div className="dashboard-content">
        
                <h2>TRANG CHỦ</h2>
                <span>

                    {new Date().toLocaleDateString("vi-VN")}

                </span>
        
                <div className="dashboard-cards">

                    <div className="dashboard-card member">

                        <div className="dashboard-icon">

                            <FaUsers/>

                        </div>

                        <div>

                            <p>Tổng hội viên</p>

                            <h2>{dashboard.totalMembers}</h2>

                        </div>

                    </div>

                    <div className="dashboard-card checkin">

                        <div className="dashboard-icon">

                            <FaClipboardCheck/>

                        </div>

                        <div>

                            <p>Check-in hôm nay</p>

                            <h2>{dashboard.todayCheckins}</h2>

                        </div>

                    </div>

                    <div className="dashboard-card service">

                        <div className="dashboard-icon">

                            <FaConciergeBell/>

                        </div>

                        <div>

                            <p>Dịch vụ chờ</p>

                            <h2>{dashboard.pendingServices}</h2>

                        </div>

                    </div>

                    <div className="dashboard-card revenue">

                        <div className="dashboard-icon">

                            <FaMoneyBillWave/>

                        </div>

                        <div>

                            <p>Doanh thu hôm nay</p>

                            <h2>

                                {(dashboard.todayRevenue||0).toLocaleString("vi-VN")}đ

                            </h2>

                        </div>

                    </div>

                </div>  

                <div className="dashboard-bottom">

                    <div className="dashboard-box">

                        <h3>CHECK-IN GẦN ĐÂY</h3>

                        <table>

                            <thead>

                                <tr>

                                    <th>Mã HV</th>

                                    <th>Họ tên</th>

                                    <th>Thời gian</th>

                                </tr>

                            </thead>

                            <tbody>

                                {
                                    checkins.length===0 ?

                                    <tr>

                                        <td colSpan={3}>
                                            Chưa có dữ liệu
                                        </td>

                                    </tr>

                                    :

                                    checkins.map(item=>

                                        <tr key={item.id}>

                                            <td>{item.member_code}</td>

                                            <td>{item.fullname}</td>

                                            <td>{formatDate(item.checkin_time)}</td>

                                        </tr>

                                    )
                                }

                                </tbody>

                        </table>

                    </div>

                    <div className="dashboard-box">

                        <h3>YÊU CẦU DỊCH VỤ</h3>

                        <table>

                            <thead>

                                <tr>

                                    <th>Mã HV</th>

                                    <th>Dịch vụ</th>

                                    <th>Yêu cầu</th>

                                </tr>

                            </thead>

                            <tbody>

                                {
                                
                                services.length===0 ?

                                    <tr>

                                        <td colSpan={3}>
                                            Chưa có dữ liệu
                                        </td>

                                    </tr>
                                    :
                                services.map(item=>

                                    <tr key={item.id}>

                                        <td>{item.member_code}</td>

                                        <td>{item.service_name}</td>

                                        <td>{formatDateTime(item.request_use_time)}</td>

                                    </tr>

                                )

                                }

                            </tbody>

                        </table>

                    </div>

                </div>
        
            </div>
        
        </div>
        
        )
}
export default Dashboard;