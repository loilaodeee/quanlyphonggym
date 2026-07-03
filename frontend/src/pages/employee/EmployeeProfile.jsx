import { useEffect, useState } from "react";
import { getEmployeeProfileApi} from "../../api/AuthApi";
import { updateProfileApi, uploadAvatarApi } from "../../api/UserApi";
import { toast } from "react-toastify";
import SideBar from "../../components/SideBar";
import "../../styles/employee/EmployeeProfile.css";
import { FaCamera, FaPhone } from "react-icons/fa6";
import { CiMail } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { getAccountStatusBadge } from "../../utils/statusBadge";
import useDocumentTitle from "../../hooks/useDocumentTitle";

function EmployeeProfile(){
    useDocumentTitle("Hồ sơ cá nhân");
    const [profile,setProfile]=useState(null);

    const [avatar,setAvatar]=useState(null);
    const [showModal,setShowModal]=useState(false);

    const [preview,setPreview]=useState(null);

    const [form,setForm]=useState({
        fullname:"",
        phone:""
    });

    async function load(){

        const data=await getEmployeeProfileApi();
    
        setProfile(data);
    
        setForm({
    
            fullname:data.fullname,
    
            phone:data.phone
    
        });
    
    }
    
    useEffect(()=>{
    
        load();
    
    },[]);

    if(!profile){

        return (
            <div className="employee-profile-loading">
                <h2>Đang tải...</h2>
            </div>
        );
    
    }

    async function handleUploadAvatar(){

        if(!avatar){
    
            return;
    
        }
    
        const data=await uploadAvatarApi(avatar);
        
        toast.success(data.message);
        setAvatar(null);
    
        load();
    
    }

    async function handleSave(){

        await updateProfileApi(form.fullname, form.phone);
    
        toast.success(
            "Cập nhật thành công"
        );
    
        load();
    
    }

    return(

        <div className="profile employee-profile-page">
        
            <div className="profile-sidebar">
        
                <SideBar/>
        
            </div>
        
            <div className="profile-content">

                <div className="profile-head">

                    <div className="profile-head-left">
                        <h3>THÔNG TIN CÁ NHÂN</h3>
                        <div className="profile-head-content">
                            <div className="profile-head-avatar">
                                <div className="profile-head-avatar-box">
                                    <img
                                        src={
                                            preview
                                            ||
                                            (
                                                profile.avatar
                                                ? `http://localhost:3000${profile.avatar}`
                                                : "/images/avatar.png"
                                            )
                                        }
                                        alt=""
                                        className="profile-avatar"
                                    />

                                    <input
                                        id="avatar-upload"
                                        hidden
                                        type="file"
                                        accept="image/*"
                                        onChange={(e)=>{

                                            const file=e.target.files[0];
                                        
                                            if(!file) return;
                                        
                                            setAvatar(file);
                                        
                                            setPreview(
                                                URL.createObjectURL(file)
                                            );
                                        
                                        }}
                                    />

                                    <label
                                        htmlFor="avatar-upload"
                                        className="btn-camera"
                                    >
                                        <FaCamera className="icon-camera"/>
                                    </label>
                                </div>

                                {
                                    avatar &&

                                    <button
                                        className="btn-upload"
                                        onClick={handleUploadAvatar}
                                    >
                                        Lưu ảnh
                                    </button>

                                }
                            </div>

                            <div className="profile-head-info">
                                <div className="profile-head-info-item">
                                    <div className="profile-info-item-left">
                                        <FaRegUser className="icon-name"/><p>Họ và tên</p>
                                    </div>
                                    <div className="profile-info-item-right">
                                        <p>{profile.fullname}</p>
                                    </div>
                                </div>

                                <div className="profile-head-info-item">
                                    <div className="profile-info-item-left">
                                        <CiMail className="icon-mail"/><p>Email</p>
                                    </div>
                                    <div className="profile-info-item-right">
                                        <p>{profile.email}</p>
                                    </div>
                                </div>

                                <div className="profile-head-info-item">
                                    <div className="profile-info-item-left">
                                        <FaPhone className="icon-phone"/><p>Số điện thoại</p>
                                    </div>
                                    <div className="profile-info-item-right">
                                        <p>{profile.phone}</p>
                                    </div>
                                </div>

                                <button
                                    className="btn-edit"
                                    onClick={()=>setShowModal(true)}
                                >
                                    Chỉnh sửa thông tin
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="profile-head-right">
                        <h3>THÔNG TIN NHÂN VIÊN</h3>
                        <div className="member-box">
                            <div className="member-row">
                                <span>Vai trò</span>
                                <strong>
                                    {profile.role_id===1 ? "Admin" : "Nhân viên"}
                                </strong>
                            </div>

                            <div className="member-row">
                                <span>Trạng thái</span>
                                <span className={getAccountStatusBadge(profile.status === "active")}>
                                    {
                                        profile.status==="active"
                                        ? "Đang hoạt động"
                                        : "Đã khóa"
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
        
            </div>
            {
                showModal &&

                <div className="modal-overlay">

                    <div className="modal-box">

                        <h3>Chỉnh sửa thông tin</h3>

                        <div className="modal-group">

                            <label>Họ tên</label>

                            <input
                                value={form.fullname}
                                onChange={(e)=>

                                    setForm({
                                        ...form,
                                        fullname:e.target.value
                                    })

                                }
                            />

                        </div>

                        <div className="modal-group">

                            <label>Số điện thoại</label>

                            <input
                                value={form.phone}
                                onChange={(e)=>

                                    setForm({
                                        ...form,
                                        phone:e.target.value
                                    })

                                }
                            />

                        </div>

                        <div className="modal-actions">

                            <button
                                onClick={()=>setShowModal(false)}
                            >
                                Hủy
                            </button>

                            <button
                                onClick={async()=>{

                                    await handleSave();

                                    setShowModal(false);

                                }}
                            >
                                Lưu
                            </button>

                        </div>

                    </div>

                </div>

                }
        </div>
        
        )
}

export default EmployeeProfile;
