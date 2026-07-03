import { Link } from "react-router-dom";
import SideBar from "../components/SideBar";
import "../styles/Trainer.css";
import { IoIosSearch } from "react-icons/io";
import { useContext, useEffect, useState } from "react";
import { getTrainers } from "../api/TrainerApi";
import { AuthContext } from "../contexts/AuthContext";
import useDocumentTitle from "../hooks/useDocumentTitle";


function Trainers(){

    useDocumentTitle("Huấn luyện viên");
    const [trainers, setTrainers]=useState([]);
    const {user}=useContext(AuthContext);
    useEffect(()=>{
        async function loadTrainers(){
            const data=await getTrainers();
            setTrainers(data);
        }
        loadTrainers();
    },[]);
    const category=[
        "Tất cả",
        "Tăng cơ",
        "Giảm cân",
        "Yoga",
        "Dinh dưỡng"
    ];
    const [search, setSearch]=useState("");
    const [selectedCate, setSelectedCate]=useState("Tất cả");
    const filterCate=trainers.filter(trainer=>(
            selectedCate==="Tất cả"||trainer.specialty.includes(selectedCate)
        )&&trainer.fullname.toLowerCase().includes(search.toLowerCase())
    )

    
    function handleSearch(e){
        setSearch(e.target.value);
    }
    return (
        <div className="trainers">
        <div className="trainer-sidebar">
            <SideBar/>
        </div>
        <div className="trainer-content">
            <h1>TẤT CẢ HUẤN LUYỆN VIÊN</h1>
            <div className="trainer-search-filter">
                <div className="trainer-search-box">
                    <IoIosSearch className="trainer-search-icon"/>
                    <input type="text" placeholder= "Tìm kiếm huấn luyện viên..." className="trainer-search" onChange={handleSearch} value={search}/>
                </div>
                
               
            </div>
            <div className="category">
                <div className="category-list">
                    {
                        category.map((cat, index)=>(
                            <button key={index} className={selectedCate===cat?"category-item active":"category-item"} onClick={()=>setSelectedCate(cat)}>{cat}</button>
                        ))
                    }
                </div>
            </div>
            <div className="trainer-container">
                {   
                    
                    filterCate.map((trainer)=>(
                        <div className="trainer-item" key={trainer.id}>
                            <div className="trainer-image-wrap">
                            <img src={`http://localhost:3000${trainer.avatar}`} alt="" className="trainer-image"/>
                            </div>
                            <h2>{trainer.fullname}</h2>
                            <p className="trainer-specialty">{trainer.specialty}</p>
                            <p className="trainer-experience">{trainer.experience} năm kinh nghiệm</p>
                            <div className="trainer-actions">
                                <Link to={user?.member?`/member/trainers/${trainer.id}`:`/trainers/${trainer.id}`} className="trainer-view">Xem chi tiết</Link>
                               
                            </div>
                            
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
    )
}
export default Trainers;