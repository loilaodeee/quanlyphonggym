import { useEffect, useState } from "react";
import { getTrainerProfile, updateTrainerInfo, updateTrainerProfileInfo, uploadTrainerAvatar } from "../../api/trainer/TrainerApi";
import SideBar from "../../components/SideBar";
import { FaCamera, FaPhone, FaRegUser } from "react-icons/fa6";
import { CiMail } from "react-icons/ci";
import avatar from "../../assets/users/avatar1.jpg";
import { toast } from "react-toastify";
import "../../styles/Style.css";
import "../../styles/trainer/TrainerProfile.css";
import useDocumentTitle from "../../hooks/useDocumentTitle";
function TrainerProfile(){
    useDocumentTitle("Hồ sơ cá nhân");
    const [trainer,setTrainer]=useState(null);
    const [fullname,setFullname]=useState("");
    const [phone,setPhone]=useState("");

    const [specialty,setSpecialty]=useState("");
    const [experience,setExperience]=useState("");
    const [description,setDescription]=useState("");

    const [showEditModal,setShowEditModal]=useState(false);
    const [showTrainerModal,setShowTrainerModal]=useState(false);

    const [avatarPreview,setAvatarPreview]=useState(null);

    useEffect(()=>{

        async function load(){

            const data =await getTrainerProfile();
            setTrainer(data);
        }

        load();

    },[]);

    if(!trainer){

        return (
            <div className="trainer-profile-loading">
                Đang tải...
            </div>
        );
    
    }

    function handleOpenModal(){

        setFullname(trainer.fullname);
    
        setPhone(trainer.phone);
    
        setShowEditModal(true);
    
    }

    async function handleUpdateProfile(){

        try{
    
            const result =
                await updateTrainerProfileInfo(
                    fullname,
                    phone
                );
    
            setTrainer({
                ...trainer,
                fullname,
                phone
            });
    
            toast.success(result.message);
    
            setShowEditModal(false);
    
        }
        catch(error){
    
            toast.error(
                error.response?.data?.message
            );
    
        }
    
    }

    async function handleUpdateTrainer(){

        try{
    
            const result =await updateTrainerInfo({
                    specialty,
                    experience,
                    description
             });
    
            setTrainer({
    
                ...trainer,
    
                specialty,
    
                experience,
    
                description
    
            });
    
            toast.success(result.message);
    
            setShowTrainerModal(false);
    
        }
        catch(error){
    
            toast.error(
                error.response?.data?.message
            );
    
        }
    
    }

    async function handleAvatarChange(e){

        const file = e.target.files[0];
    
        if(!file){
            return;
        }
    
        try{
    
            const result =await uploadTrainerAvatar(file);
    
            setTrainer({
    
                ...trainer,
    
                avatar: result.avatar
    
            });
    
            setAvatarPreview(
    
                URL.createObjectURL(file)
    
            );
    
            toast.success(result.message);
    
        }
        catch(error){
    
            toast.error(
                error.response?.data?.message
            );
    
        }
    
    }

    return(

        <div className="profile trainer-profile-page">
        
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
                                    trainer&& (
                                        <div className="profile-head-avatar-box">
                                            <img src={ avatarPreview||(trainer.avatar ? `http://localhost:3000${trainer.avatar}` :avatar)} alt="" className="profile-avatar"/>
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
                                trainer&&(
                                    <div className="profile-head-info">
                                        <div className="profile-head-info-item">
                                            <div className="profile-info-item-left">
                                                <FaRegUser className="icon-name"/><p>Họ và tên</p>
                                            </div>
                                            <div className="profile-info-item-right">
                                                <p>{trainer.fullname}</p>
                                            </div>

                                        </div>
                                        <div className="profile-head-info-item">
                                            <div className="profile-info-item-left">
                                                <CiMail className="icon-mail"/><p>Email</p>
                                            </div>
                                            <div className="profile-info-item-right">
                                                <p>{trainer.email}</p>
                                            </div>
                                        </div>
                                        <div className="profile-head-info-item">
                                            <div className="profile-info-item-left">
                                            <FaPhone className="icon-phone"/><p>Số điện thoại</p>
                                            </div>
                                            <div className="profile-info-item-right">
                                                <p>{trainer.phone}</p>
                                            </div>
                                        </div>
                                        <button className="btn-edit" onClick={handleOpenModal}>Chỉnh sửa thông tin</button>
                                    </div>
                                )
                                
                            }
                            
                            
                        </div>
                        
                    </div>

                    <div className="profile-head-right">

                        <h3>

                            THÔNG TIN HUẤN LUYỆN VIÊN

                        </h3>

                        <div className="profile-head-right-box">

                            <div className="member-row">

                                <span>

                                    Chuyên môn

                                </span>

                                <strong>

                                    {trainer.specialty}

                                </strong>

                            </div>

                            <div className="member-row">

                                <span>

                                    Kinh nghiệm

                                </span>

                                <strong>

                                    {trainer.experience} năm

                                </strong>

                            </div>

                            <button

                                className="btn-edit"

                                onClick={()=>{

                                setSpecialty(
                                    trainer.specialty
                                );

                                setExperience(
                                    trainer.experience
                                );

                                setDescription(
                                    trainer.description
                                );

                                setShowTrainerModal(true);

                                }}

                                >

                                Chỉnh sửa

                            </button>

                        </div>

                    </div>
                    
                </div>

                <div className="profile-bot">

                    <h3>

                        GIỚI THIỆU

                    </h3>

                    <div className="health-box">

                        <p>

                            {trainer.description}

                        </p>

                    </div>

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
                                value={fullname}
                                onChange={(e)=>
                                    setFullname(e.target.value)
                                }
                            />

                        </div>

                        <div className="modal-group">

                            <label>

                                Số điện thoại

                            </label>

                            <input
                                value={phone}
                                onChange={(e)=>
                                    setPhone(e.target.value)
                                }
                            />

                        </div>

                        <div className="modal-actions">

                            <button
                                onClick={()=>
                                    setShowEditModal(false)
                                }
                            >

                                Hủy

                            </button>

                            <button
                                onClick={handleUpdateProfile}
                            >

                                Lưu

                            </button>

                        </div>

                    </div>

                </div>

                )
            }

            {
            showTrainerModal && (

            <div className="modal-overlay">

                <div className="modal-box">

                    <h3>

                        Thông tin huấn luyện viên

                    </h3>

                    <div className="modal-group">

                        <label>

                            Chuyên môn

                        </label>

                        <input
                            value={specialty}
                            onChange={(e)=>
                                setSpecialty(e.target.value)
                            }
                        />

                    </div>

                    <div className="modal-group">

                        <label>

                            Kinh nghiệm (năm)

                        </label>

                        <input
                            type="number"
                            value={experience}
                            onChange={(e)=>
                                setExperience(e.target.value)
                            }
                        />

                    </div>

                    <div className="modal-group">

                        <label>

                            Giới thiệu

                        </label>

                        <textarea
                            rows={5}
                            value={description}
                            onChange={(e)=>
                                setDescription(e.target.value)
                            }
                        />

                    </div>

                    <div className="modal-actions">

                        <button
                            onClick={()=>
                                setShowTrainerModal(false)
                            }
                        >

                            Hủy

                        </button>

                        <button
                            onClick={handleUpdateTrainer}
                        >

                            Lưu

                        </button>

                    </div>

                </div>

            </div>

            )
            }
        </div>
        
        )

    
}

export default TrainerProfile;