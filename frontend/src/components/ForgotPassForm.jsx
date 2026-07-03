import { useState } from "react";
import { TbLockPassword } from "react-icons/tb";
import { CiMail } from "react-icons/ci";
import { FaLock, FaUnlockAlt } from "react-icons/fa";
import "../styles/Auth.css";

function ForgotPassForm() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    function handleSendCode(e) {
        e.preventDefault();
        // API chưa tích hợp
    }

    function handleResetPassword(e) {
        e.preventDefault();
        // API chưa tích hợp
    }

    return (
        <div className="auth-forgot-grid">
            <div className="auth-card auth-card-step">
                <TbLockPassword className="auth-step-badge" />
                <h2>Bước 1 — Quên mật khẩu</h2>

                <form className="auth-card-body" onSubmit={handleSendCode}>
                    <div className="auth-input-group">
                        <CiMail className="auth-input-icon" />
                        <input
                            type="email"
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    <button type="submit" className="auth-btn">
                        Gửi mã xác nhận
                    </button>

                    <p className="auth-step-note">
                        Mã xác nhận sẽ được gửi đến email đã đăng ký
                    </p>
                </form>
            </div>

            <div className="auth-card auth-card-step">
                <TbLockPassword className="auth-step-badge" />
                <h2>Bước 2 — Đặt lại mật khẩu</h2>

                <form className="auth-card-body" onSubmit={handleResetPassword}>
                    <div className="auth-input-group">
                        <FaUnlockAlt className="auth-input-icon" />
                        <input
                            type="text"
                            placeholder="Nhập mã xác nhận"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            autoComplete="one-time-code"
                        />
                    </div>

                    <div className="auth-input-group">
                        <FaLock className="auth-input-icon" />
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu mới"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="auth-input-group">
                        <FaLock className="auth-input-icon" />
                        <input
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                    </div>

                    <button type="submit" className="auth-btn">
                        Xác nhận
                    </button>

                    <p className="auth-step-note">
                        Mật khẩu mới cần khớp với ô xác nhận
                    </p>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassForm;
