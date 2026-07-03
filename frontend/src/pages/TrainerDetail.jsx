import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import SideBar from "../components/SideBar";

import { getTrainerById } from "../api/TrainerApi";
import { getTrainerPackages } from "../api/TrainerApi";

import "../styles/TrainerDetail.css";
import { FaRegUser } from "react-icons/fa";
import { MdFolderSpecial } from "react-icons/md";
import { MdLanguage } from "react-icons/md";
import useDocumentTitle from "../hooks/useDocumentTitle";

function TrainerDetail() {
    useDocumentTitle("Chi tiết Huấn luyện viên");
    const {id} = useParams();
    const {user} = useContext(AuthContext);
    const [trainer, setTrainer] = useState(null);
    const [packages, setPackages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [selectedPackage, setSelectedPackage] = useState(null);
    const navigate=useNavigate();
    useEffect(() => {
        async function loadData() {
            const trainerData = await getTrainerById(id);
            const packageData = await getTrainerPackages();
            setTrainer(trainerData);
            setPackages(packageData);

        }
        loadData();
    },[id]);

    if (!trainer) {
        return (
            <div className="trainer-detail-page">
                <div className="trainer-detail-sidebar"><SideBar /></div>
                <div className="page-loading-content">Đang tải...</div>
            </div>
        );
    }

    function handleChoosePackage(item) {

        if (!user) {
            navigate("/login");
            return;
        }
        if (!user.member) {
            setModalType("register");
            setShowModal(true);
    
            return;
        }
    
        setSelectedPackage(item);
        setModalType("buy");
        setShowModal(true);
    
    }

    return (

        <div className="trainer-detail-page">

            <div className="trainer-detail-sidebar">

                <SideBar />

            </div>

            <div className="trainer-detail-content">



            <div className="trainer-detail-wrapper">

                <div className="trainer-detail-left">

                    <div className="trainer-avatar-wrap">
                    <img
                        src={`http://localhost:3000${trainer.avatar}`}
                        className="trainer-avatar"
                        alt=""
                    />
                    </div>

                    <div className="trainer-info">

                        <h2>{trainer.fullname}</h2>

                        <p className="trainer-role">PT {trainer.specialty}</p>

                        <div className="trainer-meta">

                        <p><FaRegUser className="trainer-meta-icon"/>{trainer.experience} năm kinh nghiệm</p>

                            <p><MdFolderSpecial className="trainer-meta-icon"/>Chuyên môn:{" "}{trainer.specialty}</p>

                            <p><MdLanguage className="trainer-meta-icon"/>Ngôn ngữ: Tiếng Việt</p>

                        </div>

                        <div className="trainer-about">

                            <h3>Giới thiệu</h3>

                            <p>
                                Với <strong>{trainer.experience}</strong> kinh nghiệm trong lĩnh vực
                                Fitness, tôi sẽ giúp bạn đạt mục tiêu {trainer.specialty} và cải thiện sức khỏe.
                            </p>

                        </div>

                    </div>

                </div>

                <div className="trainer-detail-right">

                    <h2>GÓI PT CÁ NHÂN</h2>

                    {
                        
                        packages.map(item => (

                            <div
                                className="package-card"
                                key={item.id}
                            >

                                <div>

                                    <h3>{item.sessions} buổi</h3>
                                    <p>{item.price.toLocaleString()}đ</p>

                                </div>
                                <button onClick={()=>handleChoosePackage(item)}>Chọn</button>
                                

                        </div>

                    ))
                }

            </div>

        </div>

    </div>
        {
            showModal && (

                <div
                    className="modal-overlay"
                    onClick={() => setShowModal(false)}
                >

                    <div
                        className="modal-box"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {
                            modalType === "register" && (

                                <>
                                    <h2>Bạn cần đăng ký hội viên</h2>

                                    <p>
                                        Chỉ hội viên mới có thể đăng ký
                                        huấn luyện viên cá nhân.
                                    </p>

                                    <div className="modal-actions">

                                        <button
                                            className="btn-primary"
                                            onClick={() => navigate("/packages")}
                                        >
                                            Đăng ký
                                        </button>

                                        <button
                                            className="btn-secondary"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Để sau
                                        </button>

                                    </div>

                                </>

                            )
                        }

                        {
                            modalType === "buy" && selectedPackage && (

                                <>
                                    <h2>Xác nhận đăng ký PT</h2>

                                    <div className="modal-info">

                                        <p>

                                            <strong>Huấn luyện viên:</strong>

                                            {" "}

                                            {trainer.fullname}

                                        </p>

                                        <p>

                                            <strong>Chuyên môn:</strong>

                                            {" "}

                                            {trainer.specialty}

                                        </p>

                                        <p>

                                            <strong>Gói:</strong>

                                            {" "}

                                            {selectedPackage.package_name}

                                        </p>

                                        <p>

                                            <strong>Số buổi:</strong>

                                            {" "}

                                            {selectedPackage.sessions}

                                        </p>

                                        <p>

                                            <strong>Giá:</strong>

                                            {" "}

                                            {selectedPackage.price.toLocaleString()}đ

                                        </p>

                                    </div>

                                    <div className="modal-actions">

                                        <button
                                            className="btn-primary"
                                            onClick={() => {

                                                navigate(
                                                    `/payment?type=trainer&id=${selectedPackage.id}&trainer=${trainer.id}`
                                                );

                                            }}
                                        >
                                            Xác nhận
                                        </button>

                                        <button
                                            className="btn-secondary"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Hủy
                                        </button>

                                    </div>

                                </>
                            )
                        }
                    </div>
                </div>

            )
        }
    </div>

    );

}

export default TrainerDetail;