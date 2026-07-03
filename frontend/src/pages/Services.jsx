import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import "../styles/Service.css";
import "../styles/Style.css";

import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getServices } from "../api/ServiceApi";
import useDocumentTitle from "../hooks/useDocumentTitle";
function Services(){

    useDocumentTitle("Dịch vụ");
    const [services, setServices]=useState([]);
    useEffect(()=>{
        async function loadServices(){
            const data= await getServices();
            setServices(data);
        }
        loadServices();
    },[]);
    return(
        <div className="services">
            <div className="service-sidebar">
                <SideBar/>
            </div>
            <div className="service-content">
                <h1>TẤT CẢ DỊCH VỤ</h1>
                <div className="service-container">
                    {
                        services.map((service, index)=>(
                            <div className="service-item" key={index}>
                                <div className="service-item-top">
                                    <h2>{service.service_name}</h2>
                                    <p>{service.price.toLocaleString("vi-VN")}đ/{service.unit}</p>
                                </div>
                                <div className="service-item-bot">
                                    {
                                       service.description.split("\n").map((line, index)=>(
                                        <div className="service-description" key={index}>
                                            <FaCheckCircle className="service-description-icon"/><p>{line}</p>
                                        </div>
                                       )) 
                                    }
                                    
                                    <Link to="/packages" className="service-btn">
                                        Đăng ký ngay
                                    </Link>
                                    
                                    
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
export default Services;