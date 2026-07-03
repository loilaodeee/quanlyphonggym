import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SideBar from "../../components/SideBar";

import {
    getBookingInfo,
    bookTrainerSchedule
} from "../../api/ScheduleApi";

import "../../styles/member/PTBooking.css";
import { toast } from "react-toastify";
import useDocumentTitle from "../../hooks/useDocumentTitle";

function PTBooking() {
    useDocumentTitle("Đặt lịch PT");
    const { id } = useParams();

    const navigate = useNavigate();

    const [trainer, setTrainer] = useState(null);

    const [date, setDate] = useState("");

    const [time, setTime] = useState("");

    const times = [

        "05:00",
        "05:30",
        "06:00",
        "06:30",
        "07:00",
        "07:30",
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
        "20:30"

    ];

    useEffect(() => {

        async function loadData() {

            const data = await getBookingInfo(id);

            setTrainer(data);

        }

        loadData();

    }, [id]);

    async function handleBooking() {

        if (!date || !time) {

            alert("Vui lòng chọn ngày và giờ");

            return;

        }

        try {
            await bookTrainerSchedule({

                mem_trainer_package_id: trainer.mem_trainer_package_id,
    
                schedule_date: date,
    
                schedule_time: time
    
            });
            toast.success("Đặt lịch thành công");

            navigate("/member/schedule");
        } catch (error) {
            toast.error(error.response?.data?.message)||"Đặt lịch thất bại"
        }

        

    }

    if (!trainer) {
        return (
            <div className="pt-booking">
                <div className="pt-booking-sidebar"><SideBar /></div>
                <div className="page-loading-content">Đang tải...</div>
            </div>
        );
    }
    const today=new Date().toLocaleDateString("en-CA");

    const avaiTime=(()=>{
        if(date!==today){
            return times;
        }
        const now=new Date();
        const currentMinute=now.getHours()*60+  now.getMinutes();

        return times.filter(item=>{
            const [h,m]=item.split(":").map(Number);
            const slotMinute=h* 60 + m;
            return slotMinute >= currentMinute+30;
        })
    })();
    return (

        <div className="pt-booking">

            <div className="pt-booking-sidebar">

                <SideBar />

            </div>

            <div className="pt-booking-content">

                <div className="booking-wrapper">

                    <div className="booking-left">

                        <h2>

                            THÔNG TIN PT

                        </h2>

                        <div className="booking-avatar-wrap">
                        <img

                            src={`http://localhost:3000${trainer.avatar}`}

                            className="booking-avatar"

                        />
                        </div>

                        <h3>

                            {trainer.trainer_name}

                        </h3>

                        <p>

                            {trainer.specialty}

                        </p>

                        <p>

                            Còn lại:

                            {" "}

                            {trainer.remain}

                            {" "}

                            buổi

                        </p>

                    </div>

                    <div className="booking-right">

                        <h2>

                            CHỌN NGÀY VÀ GIỜ

                        </h2>

                        <label>

                            Ngày

                        </label>

                        <div className="gym-date-field">
                        <input

                            type="date"
                            min={today}
                            value={date}

                            onChange={(e) =>

                                setDate(e.target.value)

                            }

                        />
                        </div>

                        <label>

                            Giờ

                        </label>

                        <select

                            value={time}

                            onChange={(e) =>

                                setTime(e.target.value)

                            }

                        >

                            <option value="">

                                Chọn giờ

                            </option>

                            {

                                avaiTime.map(item => (

                                    <option

                                        key={item}

                                        value={item}

                                    >

                                        {item}

                                    </option>

                                ))

                            }

                        </select>

                        <button

                            className="booking-btn"

                            onClick={handleBooking}

                        >

                            Xác nhận đặt lịch

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default PTBooking;