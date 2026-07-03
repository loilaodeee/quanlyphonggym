import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import "../styles/Package.css";
import "../styles/Style.css";

import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getPackages } from "../api/packageApi";
import useDocumentTitle from "../hooks/useDocumentTitle";
function Packages(){
    useDocumentTitle("Gói tập");

    const [packages, setPackages]=useState([]);
    useEffect(()=>{
        async function loadPackages(){
            const data=await getPackages();
            setPackages(data);
        }
        loadPackages();
    },[]);
    return(
        <div className="packages">
            <div className="package-sidebar">
                <SideBar/>
            </div>
            <div className="package-content">
                <h1>TẤT CẢ GÓI TẬP</h1>
                <div className="package-container">
                    {
                        packages.map((pack, index)=>(
                            <div className="package-item" key={index}>
                                <div className="package-item-top">
                                    <h2>{pack.package_name}</h2>
                                    <p>{pack.price.toLocaleString("vi-VN")}đ</p>
                                </div>
                                <div className="package-item-bot">
                                    {
                                       pack.description.split("\n").map((line, index)=>(
                                        <div className="package-description" key={index}>
                                            <FaCheckCircle className="package-description-icon"/><p>{line}</p>
                                        </div>
                                       )) 
                                    }
                                    
                                    <Link to={`/payment?type=package&id=${pack.id}`} className="package-btn">
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
export default Packages;