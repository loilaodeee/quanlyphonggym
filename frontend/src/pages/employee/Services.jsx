import { useEffect, useState } from "react";

import { formatDate, formatDateTime } from "../../utils/date";
import { getEmployeeServiceStatusBadge } from "../../utils/statusBadge";
import SideBar from "../../components/SideBar";
import "../../styles/employee/Services.css";
import { confirmService, getEmployeeServices } from "../../api/employee/ServiceEmployeeApi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { toast } from "react-toastify";
import useDocumentTitle from "../../hooks/useDocumentTitle";

function EmployeeServices(){
    useDocumentTitle("Quản lý dịch vụ");
    const [services,setServices]=useState([]);

    const [keyword,setKeyword]=useState("");

    const [status,setStatus]=useState("all");

    const [page,setPage]=useState(1);

    const [total,setTotal]=useState(0);

    const limit=10;
    const totalPages=Math.ceil(total/limit);

    const pages=[];

    const [selected,setSelected]=useState(null);
    const [showModal,setShowModal]=useState(false);

    if(totalPages<=7){

        for(let i=1;i<=totalPages;i++){
            pages.push(i);
        }

    }

    else{

        if(page<=4){

            pages.push(1,2,3,4,5,"...",totalPages);

        }

        else if(page>=totalPages-3){
            pages.push(
                1,
                "...",
                totalPages-4,
                totalPages-3,
                totalPages-2,
                totalPages-1,
                totalPages
            );

        }

        else{
            pages.push(
                1,
                "...",
                page-1,
                page,
                page+1,
                "...",
                totalPages
            );

        }

    }

    async function loadServices(){

        const data=await getEmployeeServices(
            keyword,
            status,
            page,
            limit
        );
    
        setServices(data.services);
    
        setTotal(data.total);
    
    }
    useEffect(()=>{

        const timer=setTimeout(loadServices,300);
    
        return ()=>clearTimeout(timer);
    
    },[
        keyword,
        status,
        page
    ]);

    async function handleConfirmService(){

        const result=await confirmService(selected.id);
        toast.success(result.message);
        setShowModal(false);
    
        loadServices();
    
    }

    return(
        <div className="employee-services">

            <div className="employee-services-sidebar">

                <SideBar/>

            </div>

            <div className="employee-services-content">

                <h2>QUẢN LÝ DỊCH VỤ</h2>
                <div className="service-toolbar">

                    <input
                        placeholder="Tên hoặc mã hội viên"
                        value={keyword}
                        onChange={e=>{
                            setKeyword(e.target.value);
                            setPage(1);
                        }}
                    />

                    <select
                        value={status}
                        onChange={e=>{
                            setStatus(e.target.value);
                            setPage(1);
                        }}
                    >

                        <option value="all">Tất cả</option>

                        <option value="using">Chờ xác nhận</option>

                        <option value="used">Đã sử dụng</option>

                    </select>

                </div>
                <table>

                    <thead>

                        <tr>

                            <th>Mã HV</th>

                            <th>Hội viên</th>

                            <th>Dịch vụ</th>

                            <th>Loại</th>

                            <th>Yêu cầu</th>

                            <th>Trạng thái</th>

                            <th></th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            services.length===0

                            ?

                            <tr>

                                <td colSpan={7}>

                                    Không có dữ liệu

                                </td>

                            </tr>

                            :

                            services.map(item=>

                                <tr key={item.id}>

                                    <td>{item.member_code}</td>

                                    <td>{item.fullname}</td>

                                    <td>{item.service_name}</td>

                                    <td>

                                        {
                                            item.included_service
                                            ?
                                            "Bao gồm"
                                            :
                                            "Mua thêm"
                                        }

                                    </td>

                                    <td>{formatDateTime(item.request_use_time)}</td>

                                    <td>
                                        <span className={getEmployeeServiceStatusBadge(item.status)}>
                                            {item.status === "using" ? "Chờ xác nhận" : "Đã sử dụng"}
                                        </span>
                                    </td>

                                    <td>

                                    <button
                                        onClick={()=>{
                                            setSelected(item);
                                            setShowModal(true);
                                        }}
                                    >
                                        {
                                            item.status==="using"
                                            ?
                                            "Xác nhận"
                                            :
                                            "Chi tiết"
                                        }
                                    </button>

                                    </td>

                                </tr>

                            )

                        }

                    </tbody>

                </table>
                <div className="pagination">

                    <button
                        disabled={page===1}
                        onClick={()=>setPage(page-1)}
                        aria-label="Trang trước"
                    >
                        <FaChevronLeft />
                    </button>

                    {

                        pages.map((item,index)=>

                            item==="..."

                            ?

                            <span
                                key={index}
                                className="page-dot"
                            >
                                ...
                            </span>

                            :

                            <button
                                key={item}
                                className={
                                    page===item
                                    ?
                                    "active-page"
                                    :
                                    ""
                                }
                                onClick={()=>setPage(item)}
                            >
                                {item}
                            </button>

                        )

                    }

                    <button
                        disabled={page===totalPages}
                        onClick={()=>setPage(page+1)}
                        aria-label="Trang sau"
                    >
                        <FaChevronRight />
                    </button>

                </div>
            </div>
            {
                showModal &&

                <div className="service-modal-overlay">

                    <div className="service-modal">

                    <h3>CHI TIẾT DỊCH VỤ</h3>

                    <div className={getEmployeeServiceStatusBadge(selected.status)}>
                        <span className="status-dot"></span>
                        {selected.status === "using" ? "Chờ xác nhận" : "Đã sử dụng"}
                    </div>

                    <div className="service-detail">

                        <div className="service-left">

                            <img
                                src={
                                    selected.verify_photo
                                    ? `http://localhost:3000${selected.verify_photo}`
                                    : "/images/avatar.png"
                                }
                                alt=""
                                className="service-member-avatar"
                            />

                        </div>

                        <div className="service-right">

                            <p><strong>Mã HV:</strong> {selected.member_code}</p>

                            <p><strong>Họ tên:</strong> {selected.fullname}</p>

                            <p><strong>Dịch vụ:</strong> {selected.service_name}</p>

                            <p><strong>Loại:</strong> {selected.included_service ? "Bao gồm" : "Mua thêm"}</p>

                            <p>
                                <strong>Thanh toán:</strong>{" "}
                                {
                                    selected.price!=null
                                    ? `${selected.price.toLocaleString("vi-VN")}đ`
                                    : "---"
                                }
                            </p>

                            <p>
                                <strong>Yêu cầu:</strong>{" "}
                                {formatDate(selected.request_use_time)}
                            </p>

                            {
                                selected.used_date &&

                                <p>

                                    <strong>Đã sử dụng:</strong>{" "}

                                    {formatDate(selected.used_date)}

                                </p>
                            }


                        </div>

                    </div>

                    <div className="service-modal-buttons">

                        {
                            selected.status==="using" &&

                            <button
                                className="confirm-service-btn"
                                onClick={handleConfirmService}
                            >

                                Xác nhận đã sử dụng

                            </button>

                        }

                        <button
                            className="close-service-btn"
                            onClick={()=>setShowModal(false)}
                        >

                            Đóng

                        </button>

                    </div>

                    </div>
                </div>

                }
        </div>
    )
}

export default EmployeeServices;