import { useContext, useEffect, useState } from "react"
import { cancelSchedule, getMySchedule } from "../../api/ScheduleApi";
import { AuthContext } from "../../contexts/AuthContext";
import SideBar from "../../components/SideBar";
import Calendar from "react-calendar";
import "../../styles/Style.css";
import "../../styles/member/Schedule.css";
import { formatDate } from "../../utils/date";
import { Link, useNavigate } from "react-router-dom";
import { getActiveTrainerPackages } from "../../api/TrainerApi";
import { toast } from "react-toastify";
import { getScheduleStatusBadge } from "../../utils/statusBadge";
import useDocumentTitle from "../../hooks/useDocumentTitle";
function Schedule(){

    useDocumentTitle("Lịch tập");
    const {user}=useContext(AuthContext);
    const [calendarDate, setCalendarDate]=useState(new Date());
    const [schedules, setSchedules]=useState([]);
    const [seletedDate, setSelectedDate]=useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate=useNavigate();
    const [ptPackages, setPtPackages] = useState([]);

    const [showCancelModal, setShowCancelModal] =useState(false);

    const [scheduleSelected, setScheduleSelected] = useState(null);

    function handleChange(date) {

        setCalendarDate(date);
    
        const dateString = formatDate(date);
    
        const list = schedules.filter(
            item => formatDate(item.schedule_date) === dateString
        );
    
        setSelectedDate(list);
    }

    async function handleOpenBooking() {

        const data = await getActiveTrainerPackages();
    
        setPtPackages(data);
    
        setShowModal(true);
    
    }

    async function handleCancel(){
        try{

            await cancelSchedule(scheduleSelected.id);

            const data =
                await getMySchedule();

            setSchedules(data);
            const currentDate= formatDate(calendarDate);
            setSelectedDate(data.filter(item=>formatDate(item.schedule_date)===currentDate));
            
            setScheduleSelected(null);
            setShowCancelModal(false);
            toast.success(
                "Hủy lịch thành công"
            );
        }
        catch(error){

            toast.error(
                error.response?.data?.message
            );

        }
    }

    useEffect(()=>{
        async function loadSchedules() {
            const data=await getMySchedule();
            setSchedules(data);
            const today = formatDate(new Date());
            const todayDate=new Date();
            const todaySchedules = data.filter(
                item => formatDate(item.schedule_date) === today
            );

            setSelectedDate(todaySchedules);
            setCalendarDate(todayDate);
        }
        loadSchedules();
    },[user]);

    return(
        <div className="member-schedule">
            <div className="member-schedule-sidebar">
                <SideBar/>
            </div>
            <div className="member-schedule-content">
                <div className="member-schedule-header">
                    <h2>LỊCH TẬP</h2>
                </div>
                <div className="member-schedule-top">
                    <div className="member-schedule-calendar">
                    <Calendar
                        value={calendarDate}
                        onChange={handleChange}
                        tileContent={({ date }) => {

                            const dateString = formatDate(date);

                            const hasSchedule = schedules.some(
                                item => formatDate(item.schedule_date) === dateString && item.status!=="canceled"
                            );

                            return hasSchedule ? (
                
                                <div className="calendar-dot"></div>
                            ) : null;

                        }}
                    />
                    </div>

                    <div className="member-schedule-detail">
                    <button className="member-schedule-book-btn" onClick={handleOpenBooking}>Đặt lịch mới</button>
                    {
                        seletedDate.length === 0 ? (
                            <p>Không có lịch tập trong ngày này</p>
                        ) : (

                            seletedDate.filter(item=>item.status!=="canceled")
                            .map(item => (

                                <div
                                    className="member-schedule-detail-item"
                                    key={item.id}
                                >
                                    <h2>{item.schedule_time.slice(0, 5)}</h2>
                                    <h2>{formatDate(item.schedule_date)}</h2>
                                    <p>PT {item.trainer_name}</p>
                                    <p>Chuyên môn: {item.specialty}</p>
                                    <p>
                                        {
                                            item.status === "completed"
                                                ? "Đã hoàn thành"
                                                : item.status==="booked"

                                                ? "Đã đặt"

                                                : "Đã hủy"
                                        }
                                    </p>
                                </div>
                            ))
                        )
                    }
                    </div>
                </div>
                <div className="member-schedule-bottom">

                    <h2>LỊCH TẬP ĐÃ ĐĂNG KÝ</h2>

                    <div className="member-schedule-table">

                        <table>

                            <thead>

                                <tr>

                                    <th>Ngày</th>

                                    <th>Giờ</th>

                                    <th>Huấn luyện viên</th>

                                    <th>Trạng thái</th>

                                    <th>Thao tác</th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    schedules
                                        .filter(item=>item.status!=="canceled")
                                        .map(item=>(

                                            <tr key={item.id}>

                                                <td>

                                                    {formatDate(item.schedule_date)}

                                                </td>

                                                <td>

                                                    {item.schedule_time.slice(0,5)}

                                                </td>

                                                <td>

                                                    {item.trainer_name}

                                                </td>

                                                <td>

                                                    <span
                                                        className={getScheduleStatusBadge(item.status)}
                                                    >

                                                        {

                                                            item.status==="completed"

                                                            ?

                                                            "Đã hoàn thành"

                                                            :

                                                            "Đã đặt"

                                                        }

                                                    </span>

                                                </td>

                                                <td>

                                                    {

                                                        item.status==="booked"

                                                        ?

                                                        <button
                                                            className="btn-table-cancel"
                                                            onClick={()=>{

                                                                setScheduleSelected(item);

                                                                setShowCancelModal(true);

                                                            }}
                                                        >

                                                            Hủy lịch

                                                        </button>

                                                        :

                                                        <span className="table-empty">

                                                            —

                                                        </span>

                                                    }

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
                showModal && (

                    <div

                        className="schedule-modal-overlay"

                        onClick={() => setShowModal(false)}

                    >

                        <div

                            className="schedule-modal"

                            onClick={(e) => e.stopPropagation()}

                        >

                            <h2>

                                Chọn gói PT để đặt lịch

                            </h2>

                            {

                                ptPackages.length === 0 ?

                                <div className="schedule-pt-empty">

                                    <p>

                                        Bạn chưa có gói PT nào.

                                    </p>

                                    <button
                                        className="schedule-register-pt-btn"
                                        onClick={() => {
                                            setShowModal(false);
                                            navigate("/member/trainers");
                                        }}
                                    >

                                        Đăng ký gói PT

                                    </button>

                                </div>

                                :

                                ptPackages.map(item => (

                                    <div className="schedule-pt-item">

                                        <div className="schedule-pt-left">

                                            <div className="schedule-pt-avatar-wrap">
                                                <img
                                                    src={`http://localhost:3000${item.trainer_avatar}`}
                                                    className="schedule-pt-avatar"
                                                    alt=""
                                                />
                                            </div>

                                        </div>

                                        <div className="schedule-pt-info">

                                            <h3>{item.trainer_name}</h3>

                                            <p>{item.package_name}</p>

                                            <p>
                                                Đã tập: {item.used_sessions}/{item.total_sessions}
                                            </p>

                                            <p>
                                                Còn {item.remain} buổi
                                            </p>

                                        </div>

                                        <div className="schedule-pt-action">

                                            <button
                                                onClick={() =>
                                                    navigate(`/member/pt-booking/${item.id}`)
                                                }
                                            >
                                                Đặt lịch
                                            </button>

                                        </div>

                                    </div>

                                ))

                            }

                        </div>

                    </div>

                )
            }

            {
                showCancelModal && (

                    <div
                        className="schedule-modal-overlay"
                        onClick={() =>
                            setShowCancelModal(false)
                        }
                    >

                        <div
                            className="schedule-confirm-modal"
                            onClick={(e)=>
                                e.stopPropagation()
                            }
                        >

                            <h2>

                                Xác nhận hủy lịch

                            </h2>
                            {
                                scheduleSelected && (

                                    <>

                                        <p>

                                            PT:
                                            {" "}
                                            <strong>
                                                {scheduleSelected.trainer_name}
                                            </strong>

                                        </p>

                                        <p>

                                            Ngày:
                                            {" "}
                                            <strong>
                                                {formatDate(
                                                    scheduleSelected.schedule_date
                                                )}
                                            </strong>

                                        </p>

                                        <p>

                                            Giờ:
                                            {" "}
                                            <strong>
                                                {
                                                    scheduleSelected.schedule_time
                                                        ?.slice(0,5)
                                                }
                                            </strong>

                                        </p>

                                    </>

                                )
                            }
                            <p>

                                Bạn có chắc muốn hủy
                                lịch tập này không?

                            </p>

                            <div
                                className="confirm-actions"
                            >

                                <button
                                    className="btn-cancel"
                                    onClick={() =>{
                                        setShowCancelModal(false)
                                        setScheduleSelected(null);
                                    }
                                        
                                    }
                                >

                                    Không

                                </button>

                                <button
                                    className="btn-confirm"
                                    onClick={handleCancel}
                                >

                                    Hủy lịch

                                </button>

                            </div>

                        </div>

                    </div>

                )
            }
        </div>
        
    )
}

export default Schedule;