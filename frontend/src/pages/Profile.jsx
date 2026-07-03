import SideBar from "../components/SideBar";
import "../styles/Style.css";
import "../styles/Profile.css";
import { AuthContext } from "../contexts/AuthContext";
import {useContext, useEffect, useState } from "react";
import { FaPhone } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import avatar from "../assets/users/avatar1.jpg";
import { FaCamera } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { IoIosWarning } from "react-icons/io";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { updateMemberInfo, updateProfileApi, uploadAvatarApi, uploadVerifyPhoto } from "../api/UserApi";
import { getAccountStatusBadge } from "../utils/statusBadge";
import { formatDate } from "../utils/date";
import useDocumentTitle from "../hooks/useDocumentTitle";
function Profile(){

    useDocumentTitle("Hồ sơ");
    const {user, setUser}=useContext(AuthContext);
    const [fullname, setFullName] = useState("");
    const [phone, setPhone] = useState("");

    const [gender,setGender]=useState("");
    const [birthday,setBirthday]=useState("");
    const [height,setHeight]=useState("");
    const [weight,setWeight]=useState("");
    const [address,setAddress]=useState("");
    const [showHealthModal, setShowHealthModal]=useState(false);

    const [avatarFile, setAvatarFile]=useState(null);
    const [showEditModal, setShowEditModal]=useState(false);
    const [avatarPreview, setAvatarPreview]= useState(null);

    const [verifyPhoto, setVerifyPhoto] = useState(null);
    const [verifyPreview, setVerifyPreview] = useState(null);

    function handleOpenHealthModal(){

        setGender(user.member?.gender || "");
    
        setBirthday(user.member?.birthday || "");
    
        setHeight(user.member?.height || "");
    
        setWeight(user.member?.weight || "");
    
        setAddress(user.member?.address || "");
    
        setShowHealthModal(true);
    }

    async function handleUpdateHealth(){
        try {
            const result=await updateMemberInfo({
                gender, birthday, height, weight, address
            });

            const updateUser={
                ...user,
                member:{
                    ...user.member,
                    gender,
                    birthday,
                    height,
                    weight,
                    address
                }
            };
            
            setUser(updateUser);
            localStorage.setItem("user", JSON.stringify(updateUser));

            toast.success(result.message);
            setShowHealthModal(false);

        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    }

    function handleOpenModal(){

        setFullName(user?.fullname || "");
        setPhone(user?.phone || "");

        setShowEditModal(true);
    }
    
    async function handleUpdateProfile() {
        try {
            const result=await updateProfileApi(fullname, phone);
            const updateUser={...user, fullname, phone};
            setUser(updateUser);
            localStorage.setItem(
                "user",
                JSON.stringify(updateUser)
            );
            setShowEditModal(false);
            toast.success(result.message);
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    }
    async function handleAvatarChange(e){
        const file =
            e.target.files[0];
        if(!file){
            return;
        }
        try{
            const result =
                await uploadAvatarApi(file);
            const updatedUser = {
                ...user,
                avatar: result.avatar
            };
            setUser(updatedUser);
            localStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            ); 
            setAvatarPreview(
                URL.createObjectURL(file)
            ); 
            toast.success(
                result.message
            );
        }
        
        catch(error){
            toast.error(
                error.response?.data?.message
                || "Upload ảnh thất bại"
            );
        }
    }

    async function handleuploadVerifyPhoto(){
        if(!verifyPhoto){
            toast.error("Vui lòng chọn ảnh");
            return;
        };
        try {
            const result=await uploadVerifyPhoto(
                verifyPhoto
            )

            const updateUser={
                ...user,
                member:{
                    ...user.member,
                    verify_photo: result.verify_photo
                }
            };

            setUser(updateUser);
            localStorage.setItem("user", JSON.stringify(updateUser));

            toast.success(result.message);
            setVerifyPhoto(null);
            setVerifyPreview(null);
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
        
    }
    return(
        <div className="profile">
            <div className="profile-sidebar">
                <SideBar/>
            </div>
            <div className="profile-content">
                <div className="profile-head">
                    <div className="profile-head-left">
                        <h3>THÔNG TIN CÁ NHÂN</h3>
                        <div className="profile-head-content">
                            <div className="profile-head-avatar">
                                {
                                    user&& (
                                        <div className="profile-head-avatar-box">
                                            <img src={ avatarPreview||(user.avatar ? `http://localhost:3000${user.avatar}` :avatar)} alt="" className="profile-avatar"/>
                                            <input
                                                type="file"
                                                id="avatar-upload"
                                                hidden
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                            />

                                            <label
                                                htmlFor="avatar-upload"
                                                className="btn-camera"
                                            >
                                                <FaCamera className="icon-camera"/>
                                            </label>
                                        </div>
                                        
                                    )
                                }
                            </div>
                            {
                                user&&(
                                    <div className="profile-head-info">
                                        <div className="profile-head-info-item">
                                            <div className="profile-info-item-left">
                                                <FaRegUser className="icon-name"/><p>Họ và tên</p>
                                            </div>
                                            <div className="profile-info-item-right">
                                                <p>{user.fullname}</p>
                                            </div>

                                        </div>
                                        <div className="profile-head-info-item">
                                            <div className="profile-info-item-left">
                                                <CiMail className="icon-mail"/><p>Email</p>
                                            </div>
                                            <div className="profile-info-item-right">
                                                <p>{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="profile-head-info-item">
                                            <div className="profile-info-item-left">
                                            <FaPhone className="icon-phone"/><p>Số điện thoại</p>
                                            </div>
                                            <div className="profile-info-item-right">
                                                <p>{user.phone}</p>
                                            </div>
                                        </div>
                                        <button className="btn-edit" onClick={handleOpenModal}>Chỉnh sửa thông tin</button>
                                    </div>
                                )
                                
                            }
                            
                            
                        </div>
                        
                    </div>
                    <div className="profile-head-right">
                        {
                            user?.member ? (
                                <div>
                                    <h3>THÔNG TIN HỘI VIÊN</h3>

                                    <div className="profile-head-right-box member-box">

                                        <div className="member-row">
                                            <span>Mã hội viên</span>
                                            <strong>{user.member.member_code}</strong>
                                        </div>

                                        <div className="member-row">
                                            <span>Ngày tham gia</span>
                                            <strong>{formatDate(user.member.joined_date)}</strong>
                                        </div>

                                        <div className="member-row">
                                            <span>Trạng thái</span>

                                            <span className={getAccountStatusBadge(true)}>
                                                Đang hoạt động
                                            </span>
                                        </div>
                                        <hr />

                                        <h4>Ảnh hội viên</h4>

                                        <p className="verify-note">

                                        Ảnh này dùng để nhân viên xác minh
                                        khi Check-in (Hãy cập nhật ảnh khuôn mặt bạn).

                                        </p>

                                        {
                                            user.member.verify_photo ?
                                            (
                                                <>

                                                <img

                                                    src={`http://localhost:3000${user.member.verify_photo}`}

                                                    className="verify-photo"

                                                />

                                                <span className="status-badge status-badge--accent verify-status-badge">

                                                    <FaCheck /> Đã cập nhật ảnh xác minh

                                                </span>

                                                <small>

                                                    Muốn thay đổi ảnh vui lòng
                                                    liên hệ nhân viên.

                                                </small>

                                            </>
                                            )
                                            :
                                            (
                                                <>
                                                <input

                                                type="file"
                                                hidden
                                                id="verify-upload"
                                                accept="image/*"

                                                onChange={(e)=>{

                                                    setVerifyPhoto(
                                                        e.target.files[0]
                                                    );

                                                    setVerifyPreview(
                                                        URL.createObjectURL(
                                                            e.target.files[0]
                                                        )
                                                    );

                                                }}

                                                />
                                                <label
                                                    htmlFor="verify-upload"
                                                    className="btn-upload"
                                                >
                                                    Chọn ảnh
                                                </label>
                                                {
                                                    verifyPreview && (

                                                        <img

                                                            src={verifyPreview}

                                                            className="verify-photo"

                                                        />

                                                    )
                                                }
                                                <button

                                                    className="btn-upload"

                                                    onClick={handleuploadVerifyPhoto}

                                                    >

                                                    Lưu ảnh xác minh

                                                    </button>
                                                </>
                                                
                                            )
                                            
                                        }
                        
                                    </div>
                                </div>
                            ):
                            (
                                <div>
                                    <h3>TRẠNG THÁI TÀI KHOẢN</h3>
                                    <div className="profile-head-right-box">
                                        <IoIosWarning className="icon-warn"/>
                                        <h4>TÀI KHOẢN CHƯA KÍCH HOẠT</h4>
                                        <p>Bạn chưa là hội viên của Ariess Fitness</p>
                                        <p>Hãy đăng ký gói tập để trải nghiệm đẩy đủ các dịch vụ</p>
                                        <Link to="/packages"><button className="package-link">Xem gói tập</button></Link>
                                        <p>Hoặc liên hệ tư vấn miễn phí</p>
                                        <Link to="/contact"><button className="contact-link">Liên hệ</button></Link>
                                        
                                    </div>
                                </div>
                            )
                        }
                            
                    </div>
                </div>
                <div className="profile-bot">

                {

                    user?.member && (

                        <>
                            <button
                                className="btn-edit"
                                onClick={handleOpenHealthModal}
                            >
                                Cập nhật sức khỏe
                            </button>
                            <h3>THÔNG TIN SỨC KHỎE</h3>

                            <div className="health-box">

                                <div className="health-item">

                                    <span>Giới tính</span>

                                    <strong>{user.member.gender}</strong>

                                </div>

                                <div className="health-item">

                                    <span>Ngày sinh</span>

                                    <strong>{formatDate(user.member.birthday)}</strong>

                                </div>

                                <div className="health-item">

                                    <span>Chiều cao</span>

                                    <strong>{user.member.height} cm</strong>

                                </div>

                                <div className="health-item">

                                    <span>Cân nặng</span>

                                    <strong>{user.member.weight} kg</strong>

                                </div>

                                <div className="health-item address">

                                    <span>Địa chỉ</span>

                                    <strong>{user.member.address}</strong>

                                </div>

                            </div>

                        </>

                    )

                }

            </div>
            </div>
            {
                showEditModal && (

                <div className="modal-overlay">

                    <div className="modal-box">

                        <h3>
                            Chỉnh sửa thông tin
                        </h3>

                        <div className="modal-group">

                            <label>
                                Họ và tên
                            </label>

                            <input
                                type="text"
                                value={fullname}
                                onChange={(e)=>
                                    setFullName(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="modal-group">

                            <label>
                                Số điện thoại
                            </label>

                            <input
                                type="text"
                                value={phone}
                                onChange={(e)=>
                                    setPhone(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="modal-actions">

                            <button
                                onClick={()=>
                                    setShowEditModal(
                                        false
                                    )
                                }
                            >
                                Hủy
                            </button>

                            <button
                                onClick={
                                    handleUpdateProfile
                                }
                            >
                                Lưu
                            </button>

                        </div>

                    </div>

                </div>

            )
        }

        {
        showHealthModal && (

        <div className="modal-overlay">

            <div className="modal-box">

                <h3>
                    Cập nhật sức khỏe
                </h3>

                <div className="modal-group">

                    <label>
                        Giới tính
                    </label>

                    <select
                        value={gender}
                        onChange={(e)=>
                            setGender(
                                e.target.value
                            )
                        }
                    >
                        <option value="">
                            Chọn
                        </option>

                        <option value="Nam">
                            Nam
                        </option>

                        <option value="Nữ">
                            Nữ
                        </option>
                    </select>

                </div>

                <div className="modal-group">

                    <label>
                        Ngày sinh
                    </label>

                    <div className="gym-date-field">
                    <input
                        type="date"
                        value={birthday}
                        onChange={(e)=>
                            setBirthday(
                                e.target.value
                            )
                        }
                    />
                    </div>

                </div>

                <div className="modal-group">

                    <label>
                        Chiều cao (cm)
                    </label>

                    <input
                        type="number"
                        value={height}
                        onChange={(e)=>
                            setHeight(
                                e.target.value
                            )
                        }
                    />

                </div>

                <div className="modal-group">

                    <label>
                        Cân nặng (kg)
                    </label>

                    <input
                        type="number"
                        value={weight}
                        onChange={(e)=>
                            setWeight(
                                e.target.value
                            )
                        }
                    />

                </div>

                <div className="modal-group">

                    <label>
                        Địa chỉ
                    </label>

                    <textarea
                        value={address}
                        onChange={(e)=>
                            setAddress(
                                e.target.value
                            )
                        }
                    />

                </div>

                <div className="modal-actions">

                    <button
                        onClick={()=>
                            setShowHealthModal(false)
                        }
                    >
                        Hủy
                    </button>

                    <button
                        onClick={handleUpdateHealth}
                    >
                        Lưu
                    </button>

                </div>

            </div>

        </div>

        )}
        </div>
    )
}

export default Profile;
