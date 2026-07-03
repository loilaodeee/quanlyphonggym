import background from "../assets/background.png";

import logo_hor from "../assets/logo-hor.png";

import logo from "../assets/logo.png";

import { Link } from "react-router-dom";

import { FaArrowLeftLong } from "react-icons/fa6";

import "../styles/Auth.css";



function AuthLayout({ children, showBackLink = false, wide = false }) {

    return (

        <div className="auth-page">

            <div className="auth-hero">

                <img src={background} alt="" className="auth-hero-bg" />

                <div className="auth-hero-overlay" />



                <div className="auth-hero-content">

                    <Link to="/" className="auth-logo-hor-link">

                        <img src={logo_hor} alt="Ariess Fitness" className="auth-logo-hor" />

                    </Link>



                    <div className="auth-hero-main">

                        <img src={logo} alt="" className="auth-logo-deco" aria-hidden="true" />

                    </div>



                    <p className="auth-hero-tagline">

                        Kích hoạt sức mạnh — Trải nghiệm đẳng cấp tại Ariess Fitness

                    </p>

                </div>

            </div>



            <div className="auth-panel">

                {showBackLink && (

                    <Link to="/login" className="auth-back-link">

                        <FaArrowLeftLong className="auth-back-icon" />

                        <span>Quay lại đăng nhập</span>

                    </Link>

                )}

                <div className={`auth-panel-inner${wide ? " auth-panel-wide" : ""}`}>

                    {children}

                </div>

            </div>

        </div>

    );

}



export default AuthLayout;

