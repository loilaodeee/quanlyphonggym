import { useContext, useEffect, useState } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { TbLockPassword } from "react-icons/tb";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import logo from "../assets/logo.png";
import { AuthContext } from "../contexts/AuthContext";
import { loginApi } from "../api/AuthApi";
import { toast } from "react-toastify";
import "../styles/Auth.css";


function LoginForm() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams]=useSearchParams();
    const [logindata, setLogindata] = useState(searchParams.get("member")||"");
    const [password, setPassword] = useState("");

    async function handleLogin(e) {
        e.preventDefault();
        try {
            const result = await loginApi(logindata, password);
            localStorage.setItem("token", result.token);

            const user = result.user;
            login(user);
            if (user?.member) {
                navigate("/member");
            } else if (user?.role_id === 2) {
                navigate("/employee");
            } else if(user?.role_id===3){
                navigate("/trainer");
            } 
            
            else {
                navigate("/");
            }
        } catch (e) {
            toast.error(e.response?.data?.message || "Đăng nhập thất bại");
        }
    }

    return (
        <div className="auth-card">
            <div className="auth-card-header">
                <Link to="/">
                    <img src={logo} alt="Ariess Fitness" />
                </Link>
                <h1>Đăng nhập</h1>
                <p className="auth-subtitle">Chào mừng bạn quay trở lại Ariess Fitness</p>
            </div>

            <form className="auth-card-body" onSubmit={handleLogin}>
                <div className="auth-input-group">
                    <FaCircleUser className="auth-input-icon" />
                    <input
                        type="text"
                        value={logindata}
                        placeholder="Nhập email hoặc mã hội viên"
                        onChange={(e) => setLogindata(e.target.value)}
                        autoComplete="username"
                    />
                </div>

                <div className="auth-input-group">
                    <TbLockPassword className="auth-input-icon" />
                    <input
                        type="password"
                        value={password}
                        placeholder="Nhập mật khẩu"
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                </div>

                <div className="auth-forgot-row">
                    <Link to="/forgot">Quên mật khẩu?</Link>
                </div>

                <button type="submit" className="auth-btn">
                    Đăng nhập
                </button>

                <div className="auth-divider">hoặc</div>

                <p className="auth-footer-text">
                    Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                </p>
            </form>
        </div>
    );
}

export default LoginForm;
