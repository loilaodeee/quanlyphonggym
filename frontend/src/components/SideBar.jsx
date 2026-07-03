import "../styles/Home.css";
import "../styles/SideBar.css";
import "../styles/Style.css";
import logo from "../assets/logo.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useContext, useState } from "react";
import  {createPortal} from "react-dom"
import { FaBars, FaXmark } from "react-icons/fa6";

function SideBar(){
    const navigate=useNavigate();
    const menuNormal=[
        {
            name:"Trang chủ",
            path: "/"
        },
        {
            name:"Gói tập",
            path: "/packages"
        },
        {
            name:"Huấn luyện viên",
            path:"/trainers"
        },
        {
            name:"Dịch vụ",
            path:"/services"
        },
        {
            name:"Liên hệ",
            path:"/contact"
        }
    ];
    const menuMember=[
        {
            name:"Trang chủ",
            path: "/member"
        },
        {
            name:"Check-in",
            path: "/member/checkin"
        },
        {
            name:"Lịch tập",
            path:"/member/schedule"
        },
        {
            name:"Gói tập của tôi",
            path:"/member/my-package"
        },
        {
            name:"Dịch vụ của tôi",
            path:"/member/my-service"
        },
        {
            name:"Huấn luyện viên",
            path:"/member/trainers"
        },
        {
            name:"Gói PT của tôi",
            path:"/member/my-trainer-package"
        },
        {
            name:"Hồ sơ cá nhân",
            path:"/profile"
        },
        {
            name:"Đăng xuất",
            path:"/logout"
        }
       
    ]
    const menuAdd =[
        {
            name: "Hồ sơ cá nhân",
            path:"/profile"
        },
        {
            name:"Đăng xuất",
            path: "/logout"
        }
    ]; 

    const menuEmployee=[
        {
            name:"Trang chủ",
            path: "/employee"
        },
        {
            name:"Check-in Hội viên",
            path: "/employee/checkin"
        },
        {
            name:"Bán gói tập",
            path:"/employee/sell-package"
        },
        {
            name:"Gia hạn gói tập",
            path:"/employee/renew-package"
        },
        {
            name:"Quản lý Hội viên",
            path:"/employee/members"
        },
        {
            name:"Quản lý dịch vụ",
            path:"/employee/services"
        },
        {
            name:"Hồ sơ cá nhân",
            path:"/employee/profile"
        },
        {
            name:"Đăng xuất",
            path:"/logout"
        }
    ]

    const menuTrainer=[
        {
            name:"Trang chủ",
            path: "/trainer"
        },
        {
            name:"Lịch dạy",
            path: "/trainer/schedules"
        },
        {
            name:"Danh sách hội viên",
            path:"/trainer/members"
        },
        {
            name:"Hồ sơ cá nhân",
            path:"/trainer/profile"
        },
        {
            name:"Đăng xuất",
            path:"/logout"
        }
    ]

    const menuAdmin=[

    ]
    const {user, logout}=useContext(AuthContext);

   

    const menu =
    user?.member
        ? menuMember
        : user?.role_id === 2
        ? menuEmployee
        : user?.role_id === 3
        ? menuTrainer
        : user?.role_id === 1
        ? menuAdmin
        : user
        ? [...menuNormal, ...menuAdd]
        : menuNormal;


    const [showModal, setShowModal]=useState(false);
    const [menuOpen, setMenuOpen]=useState(false);

    function getHomePage(){

        if(user?.member) return "/member";
    
        if(user?.role_id === 2) return "/employee";
    
        if(user?.role_id === 3) return "/trainer";
    
        if(user?.role_id === 1) return "/admin";
    
        return "/";
    }

    return (
        <>
            <button type="button" className="sidebar-toggle" onClick={()=>setMenuOpen(!menuOpen)}>
                {menuOpen ? <FaXmark /> : <FaBars />}
            </button>
            {menuOpen && <div className="sidebar-backdrop" onClick={()=>setMenuOpen(false)}></div>}
            <div className={menuOpen ? "side-bar side-bar--open" : "side-bar"}>
            <div className="side-bar-logo">
                <Link to={getHomePage()} onClick={()=>setMenuOpen(false)}><img src={logo} alt="" /></Link>
                
            </div>
            <div className="side-bar-menu">
                {
                    menu.map((item, index)=>(
                        item.path==="/logout"?
                        <div className="side-bar-item" onClick={()=>{setMenuOpen(false);setShowModal(true);}} key={index}>{item.name}</div>:
                        <NavLink to={item.path} key={item.path} end={item.path==="/member" ||item.path==="/employee" || item.path==="/trainer" || item.path==="/admin"}
                        className={({isActive})=>isActive?"side-bar-item active":"side-bar-item"}
                        onClick={()=>setMenuOpen(false)}
                        >
                        {item.name}
                        </NavLink>
                        
                    ))
                
                }
                
            </div>
            {
                    showModal&& createPortal (
                        <div className="modal-overlay">
                            <div className="modal">
                                <div className="modal-content">
                                <h2>Xác nhận</h2>
                                <p>Bạn có chắc muốn đăng xuất?</p>
                                <div className="modal-btn">
                                    <button onClick={()=>{
                                        logout();
                                        setShowModal(false);
                                        navigate("/");
                                    }}>Đồng ý</button>
                                    <button onClick={()=>setShowModal(false)}>Hủy</button>
                                </div>
                                </div>
                                
                            </div>
                        </div>
                        , document.body
                    )
                }
        </div>
        </>
    )
}

export default SideBar;
