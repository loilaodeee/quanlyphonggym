import SideBar from "../components/SideBar.jsx";
import { Link, Navigate } from "react-router-dom";
import background from "../assets/background.png";
import {AuthContext} from "../contexts/AuthContext.jsx"
import { useContext, useEffect, useState } from "react";
import { FaHandsWash } from "react-icons/fa";
import "../styles/Home.css";
import "../styles/Style.css";
import { getTrainers } from "../api/TrainerApi.js";
import { getPackages } from "../api/packageApi.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";

function Home(){

    useDocumentTitle("Trang chủ");

    const {user}=useContext(AuthContext);
    const [packages, setPackages]=useState([]);
    const [trainers, setTrainers]=useState([]);
    useEffect(()=>{
        async function loadPackages(){
            const data=await getPackages();
            setPackages(data);
        }
        loadPackages();
    },[])

    useEffect(()=>{
        async function loadTrainers(){
            const data=await getTrainers();
            setTrainers(data); 
        }
        loadTrainers();
    },[]);

    if (user) {
        if (user.member) {
            return <Navigate to="/member" replace />;
        }
        switch (user.role_id) {
            case 1:
                return <Navigate to="/admin" replace />;
            case 2:
                return <Navigate to="/employee" replace />;
            case 3:
                return <Navigate to="/trainer" replace />;
        }
    }

    return(
        <div className="home">
            <div className="home-content">
            <div className="home-sidebar">
                <SideBar/>
            </div>
            <div className="home-container">
                <div className="home-container-top">
                    <div className="welcome">{
                        user?<h2>Xin chào, {user.fullname} <FaHandsWash className="icon-hand"/></h2>:""
                        }</div>
                    {
                        !user && <Link to="/login" className="login-link">Đăng nhập</Link>
                    }
                    
                </div>
                <div className="home-container-mid">
                    <div className="home-container-mid-left">
                        <h2>Kích hoạt hội viên ngay hôm nay</h2>
                        <p>Trải nghiệm tất cả dịch vụ tại Ariess Fitness</p>
                        {
                            user?<Link to="/packages" className="package-link">Xem gói tập</Link>:
                            <Link to="/login" className="package-link">Xem gói tập</Link>
                        }
                        
                    </div>
                    <div className="home-container-mid-right">
                        <img src={background} alt="" />
                    </div>
                </div>
                <div className="home-container-bot">
                    <div className="title-link">
                        <h2>GÓI TẬP NỔI BẬT</h2>
                        <Link to="/packages">Xem tất cả</Link> 
                    </div>
                    
                    <div className="home-container-bot-packages">
                    {
                        
                        packages.map((pack, index)=>(
                                <div className="home-container-bot-item" key={index}>
                                    <h2>{pack.package_name}</h2>
                                    <p className="price">{pack.price.toLocaleString("vi-VN")}đ</p>
                                    <Link to="">Xem chi tiết</Link>
                                </div>

                            
                        ))
                    }

                    </div>
                    <div className="title-link">
                        <h2>HUẤN LUYỆN VIÊN NỔI BẬT</h2>
                        <Link to="/trainers">Xem tất cả</Link> 
                    </div>
                    <div className="home-container-bot-trainers">
                        {
                            trainers.map((trainer, index)=>(
                                trainer.is_featured===1 &&
                                <div className="home-container-bot-trainers-item" key={index}>
                                    <div className="trainers-item-left">
                                        <img src={`http://localhost:3000${trainer.avatar}`} alt="" />
                                    </div>
                                    <div className="trainers-item-right">
                                        <h3>{trainer.fullname}</h3>
                                        <p>{trainer.specialty}</p>
                                    </div>
                                </div>
                            ))
                        }
                        
                    </div>
                    
                </div>
            </div>
            </div>
            
            <div className="home-footer"></div>
        </div>
    )
}
export default Home;