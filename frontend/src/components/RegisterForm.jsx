import { useState } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { TbLockPassword } from "react-icons/tb";
import { FaPhoneAlt } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerApi } from "../api/AuthApi";
import logo from "../assets/logo.png";
import "../styles/Auth.css";

function RegisterForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [fullname, setFullname] = useState("");
    const navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault();
        try {
            const result = await registerApi(email, password, phone, fullname);
            toast.success(result.message);
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Đăng ký thất bại");
        }
    }

    return (
        <div className="auth-card auth-card-compact">
            <div className="auth-card-header">
                <Link to="/">
                    <img src={logo} alt="Ariess Fitness" />
                </Link>
                <h1>Đăng ký</h1>
                <p className="auth-subtitle">Tạo tài khoản để bắt đầu hành trình fitness</p>
            </div>

            <form className="auth-card-body" onSubmit={handleRegister}>
                <div className="auth-input-group">
                    <FaCircleUser className="auth-input-icon" />
                    <input
                        type="email"
                        value={email}
                        placeholder="Nhập email"
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                    />
                </div>

                <div className="auth-input-group">
                    <TbLockPassword className="auth-input-icon" />
                    <input
                        type="password"
                        value={password}
                        placeholder="Nhập mật khẩu"
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                </div>

                <div className="auth-input-group">
                    <FaPhoneAlt className="auth-input-icon" />
                    <input
                        type="tel"
                        value={phone}
                        placeholder="Nhập số điện thoại"
                        onChange={(e) => setPhone(e.target.value)}
                        autoComplete="tel"
                    />
                </div>

                <div className="auth-input-group">
                    <MdDriveFileRenameOutline className="auth-input-icon" />
                    <input
                        type="text"
                        value={fullname}
                        placeholder="Nhập họ tên"
                        onChange={(e) => setFullname(e.target.value)}
                        autoComplete="name"
                    />
                </div>

                <button type="submit" className="auth-btn">
                    Đăng ký
                </button>

                <div className="auth-divider">hoặc</div>

                <p className="auth-footer-text">
                    Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
                </p>
            </form>
        </div>
    );
}

export default RegisterForm;
