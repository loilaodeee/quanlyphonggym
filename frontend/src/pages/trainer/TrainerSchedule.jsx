import { useEffect, useState } from "react";
import SideBar from "../../components/SideBar";
import { confirmTrainerSchedule, getTrainerMemberDetail, getTrainerSchedules } from "../../api/trainer/TrainerApi";

import "../../styles/trainer/TrainerSchedule.css";
import { formatDate, formatDateTime } from "../../utils/date";
import { toast } from "react-toastify";
import TrainerMemberDetailModal from "../../components/trainer/TrainerMemberDetailModal";
import { getScheduleStatusBadge } from "../../utils/statusBadge";
import useDocumentTitle from "../../hooks/useDocumentTitle";

function TrainerSchedule(){
    useDocumentTitle("Lịch dạy");
    const [date,setDate]=useState("");

    const [status,setStatus]=useState("all");

    const [schedules,setSchedules]=useState([]);

    const [showDetail,setShowDetail]=useState(false);
    const [memberDetail,setMemberDetail]=useState(null);

    const [showCompleteModal, setShowCompleteModal] = useState(false);

    const [scheduleSelected, setScheduleSelected] = useState(null);

    async function loadSchedules(){
        const data= await getTrainerSchedules(
                date,
                status
            );
        setSchedules(data);
    }

    useEffect(()=>{

        loadSchedules();
    
    },[date,status]);

    async function handleViewMember(memberId){

        const data= await getTrainerMemberDetail(
                memberId
            );
    
        setMemberDetail(data);
    
        setShowDetail(true);
    
    }

    async function handleComplete() {
        try {  
            await confirmTrainerSchedule(
                scheduleSelected.id
            );   
            toast.success(
                "Đã hoàn thành buổi tập"
            );   
            setShowCompleteModal(false);   
            setScheduleSelected(null);    
            await loadSchedules();    
        }    
        catch (error) {
            toast.error(
                error.response?.data?.message
            );  
        }  
    }

    return(

        <div className="trainer-schedule">

            <div className="trainer-schedule-sidebar">

                <SideBar/>

            </div>

            <div className="trainer-schedule-content">

                <div className="trainer-schedule-header">

                    <h2>LỊCH DẠY</h2>

                </div>

                <div className="trainer-schedule-filter">

                    <div>

                        <label>

                            Ngày

                        </label>

                        <div className="gym-date-field">
                        <input

                            type="date"

                            value={date}

                            onChange={(e)=>
                                setDate(e.target.value)
                            }

                        />
                        </div>

                    </div>

                    <div>

                        <label>

                            Trạng thái

                        </label>

                        <select

                            value={status}

                            onChange={(e)=>
                                setStatus(
                                    e.target.value
                                )
                            }

                        >

                            <option value="all">

                                Tất cả

                            </option>

                            <option value="booked">

                                Chờ tập

                            </option>

                            <option value="completed">

                                Đã hoàn thành

                            </option>

                            <option value="canceled">

                                Đã hủy

                            </option>

                        </select>

                    </div>

                </div>

                <div className="trainer-schedule-table-wrapper">

                    <table className="trainer-schedule-table">

                        <thead>

                            <tr>

                                <th>Giờ</th>

                                <th>Ngày</th>

                                <th>Mã HV</th>

                                <th>Họ tên</th>

                                <th>SĐT</th>

                                <th>Trạng thái</th>

                                <th>Thao tác</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                schedules.length===0 ?

                                <tr>

                                    <td
                                        colSpan={7}
                                        className="trainer-empty"
                                    >

                                        Không có lịch dạy

                                    </td>

                                </tr>

                                :

                                schedules.map(item=>

                                    <tr key={item.id}>

                                        <td>

                                            {item.schedule_time.slice(0,5)}

                                        </td>

                                        <td>

                                            {formatDate(item.schedule_date)}

                                        </td>

                                        <td>

                                            {item.member_code}

                                        </td>

                                        <td>

                                            {item.fullname}

                                        </td>

                                        <td>

                                            {item.phone}

                                        </td>

                                        <td>

                                            <span
                                                className={getScheduleStatusBadge(item.status)}
                                            >

                                                {

                                                    item.status==="booked"

                                                    ?

                                                    "Chờ tập"

                                                    :

                                                    item.status==="completed"

                                                    ?

                                                    "Hoàn thành"

                                                    :

                                                    "Đã hủy"

                                                }

                                            </span>

                                        </td>

                                        <td>

                                            <div className="trainer-table-actions">

                                                <button
                                                    className="trainer-detail-btn"
                                                    onClick={()=>
                                                        handleViewMember(item.member_id)
                                                    }
                                                >

                                                    Chi tiết

                                                </button>

                                                {

                                                    item.status==="booked" &&

                                                    <button
                                                        className="trainer-complete-btn"
                                                        onClick={()=>{
                                                            setScheduleSelected(item);
                                                            setShowCompleteModal(true);
                                                        }}
                                                    >

                                                        Hoàn thành

                                                    </button>

                                                }

                                            </div>

                                        </td>

                                    </tr>

                                )

                            }

                        </tbody>

                    </table>

                </div>

            </div>
            {
                showDetail && memberDetail && (
                    <TrainerMemberDetailModal
                        member={memberDetail}
                        onClose={() => setShowDetail(false)}
                    />
                )
            }

            {
                showCompleteModal && scheduleSelected && (

                    <div
                        className="trainer-modal-overlay"
                        onClick={() => {
                            setShowCompleteModal(false);
                            setScheduleSelected(null);
                        }}
                    >

                        <div
                            className="trainer-confirm-modal"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <h2>Xác nhận hoàn thành</h2>

                            <p>

                                Bạn xác nhận đã hoàn thành buổi tập này?

                            </p>

                            <div className="trainer-confirm-info">

                                <p>

                                    <strong>Mã hội viên:</strong>{" "}

                                    {scheduleSelected.member_code}

                                </p>

                                <p>

                                    <strong>Họ tên:</strong>{" "}

                                    {scheduleSelected.fullname}

                                </p>

                                <p>

                                    <strong>Ngày:</strong>{" "}

                                    {formatDate(scheduleSelected.schedule_date)}

                                </p>

                                <p>

                                    <strong>Giờ:</strong>{" "}

                                    {scheduleSelected.schedule_time.slice(0,5)}

                                </p>

                            </div>

                            <div className="trainer-confirm-actions">

                                <button
                                    className="trainer-btn-confirm"
                                    onClick={handleComplete}
                                >

                                    Xác nhận

                                </button>

                                <button
                                    className="trainer-btn-cancel"
                                    onClick={() => {

                                        setShowCompleteModal(false);

                                        setScheduleSelected(null);

                                    }}
                                >

                                    Hủy

                                </button>

                            </div>

                        </div>

                    </div>

                )
            }
        </div>

    )

}

export default TrainerSchedule;