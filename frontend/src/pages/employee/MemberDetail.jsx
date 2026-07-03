import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SideBar from "../../components/SideBar";
import { getMemberCheckin, getMemberDetail, getMemberHistory, getMemberServices, getMemberTrainerHistory, updateMember } from "../../api/employee/MemberApi";
import { formatDate } from "../../utils/date";
import { getAccountStatusBadge } from "../../utils/statusBadge";

import "../../styles/employee/MemberDetail.css";
import { FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import useDocumentTitle from "../../hooks/useDocumentTitle";

function MemberDetail() {
    useDocumentTitle("Chi tiết hội viên");
    const { id } = useParams();

    const navigate = useNavigate();

    const [member, setMember] = useState(null);

    const [history,setHistory]=useState([]);
    const [checkins,setCheckins]=useState([]);

    const [services,setServices]=useState([]);
    const [trainers,setTrainers]=useState([]);
    const [tab,setTab]=useState("package");

    const [showEditModal,setShowEditModal]=useState(false);

    const [verifyPhoto,setVerifyPhoto]=useState(null);

    const [editForm,setEditForm]=useState({
        fullname:"",
        phone:"",
        gender:"",
        birthday:"",
        height:"",
        weight:"",
        address:""
    });

    const fileRef=useRef();
    const [saving,setSaving]=useState(false);

    function handleOpenEdit(){

        setEditForm({
            fullname:member.fullname || "",
            phone:member.phone || "",
            gender:member.gender || "",
            birthday:member.birthday?.slice(0,10) || "",
            height:member.height || "",
            weight:member.weight || "",
            address:member.address || ""
        });
    
        setVerifyPhoto(null);
    
        setShowEditModal(true);
    
    }

    async function handleSave(){
        setSaving(true);
        try{
            
            const formData=new FormData();
    
            formData.append("fullname",editForm.fullname);
            formData.append("phone",editForm.phone);
            formData.append("gender",editForm.gender);
            formData.append("birthday",editForm.birthday);
            formData.append("height",editForm.height);
            formData.append("weight",editForm.weight);
            formData.append("address",editForm.address);
    
            if(verifyPhoto){
    
                formData.append(
                    "verifyPhoto",
                    verifyPhoto
                );
    
            }
    
            await updateMember(member.id,formData);
    
            toast.success("Cập nhật thành công");
    
            const data=await getMemberDetail(member.id);
    
            setMember(data);
    
            setShowEditModal(false);
    
        }
    
        catch(error){
    
            toast.error(
                error.response?.data?.message
                ||
                "Cập nhật thất bại"
            );
    
        }
        finally{
            setSaving(false);
        }
    
    }

    function closeModal(){

        setVerifyPhoto(null);
    
        setShowEditModal(false);
    
    }

    useEffect(() => {

        async function load(){

            const detail =await getMemberDetail(id);
        
            setMember(detail);
        
            const history =await getMemberHistory(id);
        
            setHistory(history);
            const checkins=await getMemberCheckin(id);

            setCheckins(checkins);

            const services=await getMemberServices(id);

            setServices(services);

            const trainers=await getMemberTrainerHistory(id);

            setTrainers(trainers);
        
        }

        load();

    }, []);



    if (!member) {
        return (
            <div className="employee-member-detail">
                <div className="employee-member-sidebar"><SideBar /></div>
                <div className="page-loading-content">Đang tải...</div>
            </div>
        );
    }

    return (

        <div className="employee-member-detail">

            <div className="employee-member-sidebar">

                <SideBar />

            </div>

            <div className="employee-member-content">

                <h2>CHI TIẾT HỘI VIÊN</h2>

                <div className="member-detail-card">

                    <div className="member-avatar">

                        <img src={`http://localhost:3000${member.verify_photo}`} alt="" />

                    </div>

                    <div className="member-info">

                        <p><strong>Mã hội viên:</strong> {member.member_code}</p>

                        <p><strong>Họ tên:</strong> {member.fullname}</p>

                        <p><strong>Email:</strong> {member.email}</p>

                        <p><strong>SĐT:</strong> {member.phone}</p>

                        <p><strong>Giới tính:</strong> {member.gender || "---"}</p>

                        <p><strong>Ngày sinh:</strong> {member.birthday ? formatDate(member.birthday) : "---"}</p>

                        <p><strong>Chiều cao:</strong> {member.height ? `${member.height} cm` : "---"}</p>

                        <p><strong>Cân nặng:</strong> {member.weight ? `${member.weight} kg` : "---"}</p>

                        <p><strong>Địa chỉ:</strong> {member.address || "---"}</p>

                        <p><strong>Ngày tham gia:</strong> {formatDate(member.joined_date)}</p>

                        <p><strong>Trạng thái:</strong>{" "}
                            <span className={getAccountStatusBadge(member?.status === "active")}>
                                {member?.status === "active" ? "Đang hoạt động" : "Không hoạt động"}
                            </span>
                        </p>

                    </div>

                </div>

                <div className="member-package-card">

                    <h3>GÓI TẬP HIỆN TẠI</h3>

                    <p><strong>Gói tập:</strong> {member.package_name || "---"}</p>

                    <p><strong>Ngày bắt đầu:</strong> {member.start_date ? formatDate(member.start_date) : "---"}</p>

                    <p><strong>Ngày hết hạn:</strong> {member.end_date ? formatDate(member.end_date) : "---"}</p>

                </div>

                <div className="member-tabs">

                    <button
                        className={tab==="package" ? "active" : ""}
                        onClick={()=>setTab("package")}
                    >
                        Lịch sử gói tập
                    </button>

                    <button
                        className={tab==="checkin" ? "active" : ""}
                        onClick={()=>setTab("checkin")}
                    >
                        Check-in
                    </button>
                    <button
                        className={tab==="service" ? "active" : ""}
                        onClick={()=>setTab("service")}
                    >
                        Dịch vụ
                    </button>
                    <button
                        className={tab==="trainer" ? "active" : ""}
                        onClick={()=>setTab("trainer")}
                    >
                        Gói PT
                    </button>
                    

                </div>

                {
                    tab==="package"

                    &&

                    <div className="member-history-card">

                        <table className="member-history-table">

                            <thead>

                                <tr>

                                    <th>Ngày</th>

                                    <th>Loại</th>

                                    <th>Gói</th>

                                    <th>Thanh toán</th>

                                    <th>Số tiền</th>

                                </tr>

                            </thead>

                            <tbody>

                                {
                                    history.length===0

                                    ?

                                    <tr>

                                        <td colSpan={5}>

                                            Chưa có lịch sử

                                        </td>

                                    </tr>

                                    :

                                    history.map(item=>(

                                        <tr key={item.id}>

                                            <td>{formatDate(item.created_at)}</td>

                                            <td>
                                                {
                                                    item.payment_type==="buy_package"
                                                    ? "Đăng ký"
                                                    : "Gia hạn"
                                                }
                                            </td>

                                            <td>{item.package_name}</td>

                                            <td>
                                                {
                                                    item.payment_method==="cash"
                                                    ? "Tiền mặt"
                                                    : "QR"
                                                }
                                            </td>

                                            <td>{item.price.toLocaleString("vi-VN")}đ</td>

                                        </tr>

                                    ))
                                }

                            </tbody>

                        </table>

                    </div>
                }

                {
                    tab==="checkin"

                    &&

                    <div className="member-checkin-card">

                        <table className="member-checkin-table">

                            <thead>

                                <tr>

                                    <th>#</th>

                                    <th>Ngày</th>

                                    <th>Giờ</th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    checkins.length===0

                                    ?

                                    <tr>

                                        <td colSpan={3}>

                                            Chưa có dữ liệu

                                        </td>

                                    </tr>

                                    :

                                    checkins.map((item,index)=>(

                                        <tr key={item.id}>

                                            <td>{index+1}</td>

                                            <td>{formatDate(item.checkin_time)}</td>

                                            <td>

                                                {
                                                    new Date(item.checkin_time)
                                                    .toLocaleTimeString(
                                                        "vi-VN",
                                                        {
                                                            hour:"2-digit",
                                                            minute:"2-digit"
                                                        }
                                                    )
                                                }

                                            </td>

                                        </tr>

                                    ))

                                }

                            </tbody>

                        </table>

                    </div>
                }

                {
                    tab==="service" && (

                        <div className="member-service-card">

                            <h3>LỊCH SỬ DỊCH VỤ</h3>

                            <table>

                                <thead>

                                    <tr>
                                        <th>Ngày</th>
                                        <th>Dịch vụ</th>
                                        <th>Loại</th>
                                        <th>Ngày sử dụng</th>
                                        <th>Thanh toán</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {
                                        services.length===0 ?

                                        <tr>
                                            <td colSpan={5}>Chưa có dữ liệu</td>
                                        </tr>

                                        :

                                        services.map(item=>

                                            <tr key={item.id}>

                                                <td>{formatDate(item.created_at)}</td>

                                                <td>{item.service_name}</td>
                                                <td>{item.included_service ? "Bao gồm" : "Mua thêm"}</td>
                                                <td>{item.used_date ? formatDate(item.used_date) : "---"}</td>

                                                <td>{item.price ? `${item.price.toLocaleString("vi-VN")}đ` : "---"}</td>

                                            </tr>

                                        )
                                    }

                                </tbody>

                            </table>

                        </div>

                    )
                }

                {
                    tab==="trainer" && (

                        <div className="member-trainer-card">

                            <h3>LỊCH SỬ GÓI PT</h3>

                            <table>

                                <thead>

                                    <tr>
                                        <th>Ngày</th>
                                        <th>Gói PT</th>
                                        <th>PT</th>
                                        <th>Buổi</th>
                                        <th>Thanh toán</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {
                                        trainers.length===0 ?

                                        <tr>
                                            <td colSpan={5}>Chưa có dữ liệu</td>
                                        </tr>

                                        :

                                        trainers.map(item=>

                                            <tr key={item.id}>

                                                <td>{formatDate(item.created_at)}</td>

                                                <td>{item.package_name}</td>

                                                <td>{item.trainer_name}</td>

                                                <td>{item.used_sessions}/{item.total_sessions}</td>

                                                <td>{item.price != null ? `${item.price.toLocaleString("vi-VN")}đ` : "---"}</td>

                                            </tr>

                                        )
                                    }

                                </tbody>

                            </table>

                        </div>

                    )
                }

                <div className="member-detail-buttons">

                    <button onClick={() => navigate(`/employee/renew-package?member=${member.member_code}`)}>Gia hạn</button>

                    <button onClick={handleOpenEdit}>Chỉnh sửa</button>

                    <button onClick={() => navigate("/employee/members")}>Quay lại</button>

                </div>

            </div>
            {
                showEditModal &&

                <div className="member-edit-overlay">

                    <div className="member-edit-modal">
                        <button
                            type="button"
                            className="close-modal"
                            onClick={closeModal}
                        >
                            <FaXmark />
                        </button>

                        <h3>CHỈNH SỬA HỘI VIÊN</h3>

                        <div className="member-edit-avatar">
                            <h4>ẢNH XÁC MINH HỘI VIÊN</h4>
                            <img
                                src={
                                    verifyPhoto
                                    ?
                                    URL.createObjectURL(verifyPhoto)
                                    :
                                    `http://localhost:3000${member.verify_photo}`
                                }
                                alt=""
                            />
                            <p className="photo-note">
                                JPG, PNG • Tối đa 5MB
                            </p>

                            <button
                                type="button"
                                className="change-photo-btn"
                                onClick={()=>fileRef.current.click()}
                            >
                                Đổi ảnh
                            </button>

                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                style={{display:"none"}}
                                onChange={(e)=>{

                                    if(e.target.files.length>0){

                                        setVerifyPhoto(e.target.files[0]);

                                    }

                                }}
                            />

                        </div>

                        <div className="member-edit-grid">

                            <div>

                                <label>Họ tên</label>

                                <input
                                    value={editForm.fullname}
                                    onChange={e=>setEditForm({...editForm,fullname:e.target.value})}
                                />

                            </div>

                            <div>

                                <label>SĐT</label>

                                <input
                                    value={editForm.phone}
                                    onChange={e=>setEditForm({...editForm,phone:e.target.value})}
                                />

                            </div>

                            <div>

                                <label>Giới tính</label>

                                <select
                                    value={editForm.gender}
                                    onChange={e=>setEditForm({...editForm,gender:e.target.value})}
                                >
                                    <option value="">Chọn</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                </select>

                            </div>

                            <div>

                                <label>Ngày sinh</label>

                                <div className="gym-date-field">
                                <input
                                    type="date"
                                    value={editForm.birthday}
                                    onChange={e=>setEditForm({...editForm,birthday:e.target.value})}
                                />
                                </div>

                            </div>

                            <div>

                                <label>Chiều cao</label>

                                <input
                                    type="number"
                                    value={editForm.height}
                                    onChange={e=>setEditForm({...editForm,height:e.target.value})}
                                />

                            </div>

                            <div>

                                <label>Cân nặng</label>

                                <input
                                    type="number"
                                    value={editForm.weight}
                                    onChange={e=>setEditForm({...editForm,weight:e.target.value})}
                                />

                            </div>

                            <div className="full-width">

                                <label>Địa chỉ</label>

                                <input
                                    value={editForm.address}
                                    onChange={e=>setEditForm({...editForm,address:e.target.value})}
                                />

                            </div>

                        </div>

                        <div className="member-edit-buttons">

                        <button
                            disabled={saving}
                            onClick={handleSave}
                        >
                            {
                                saving
                                ?
                                "Đang lưu..."
                                :
                                "Lưu"
                            }
                        </button>

                            <button onClick={closeModal}>
                                Hủy
                            </button>

                        </div>

                    </div>

                </div>

                }
        </div>

    );

}

export default MemberDetail;