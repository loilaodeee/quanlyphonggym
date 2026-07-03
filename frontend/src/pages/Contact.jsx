import SideBar from "../components/SideBar";
import { FaLocationDot } from "react-icons/fa6";
import "../styles/Contact.css";
import useDocumentTitle from "../hooks/useDocumentTitle";
function Contact(){
    useDocumentTitle("Liên hệ");
    return (
        <div className="contact">
            <div className="contact-sidebar">
                <SideBar/>
            </div>
            <div className="contact-content">
                <div className="contact-content-head">
                    <h2>LIÊN HỆ VỚI CHÚNG TÔI</h2>
                </div>
                <div className="contact-content-container">
                    <div className="content-container-left">
                        
                        <div className="container-left-item">
                            <FaLocationDot className="container-item-icon"/><p>Địa chỉ<br/>180 Cao Lỗ, Phường 4, Quận 8, TPHCM</p>
                        </div>
                        <div className="container-left-item">
                        <FaLocationDot className="container-item-icon"/><p>Hotline<br/>0943438684</p>
                        </div>
                        <div className="container-left-item">
                        <FaLocationDot className="container-item-icon"/><p>Email<br/>nguyenloi1442@gmail.com</p>
                        </div>
                        <div className="container-left-item">
                        <FaLocationDot className="container-item-icon"/><p>Giờ mở cửa<br/><b>08:00 - 20:00</b> <br/>Thứ 2 - Chủ nhật</p>
                        </div>
                        <div className="content-container-map">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.9615802554185!2d106.67510897406957!3d10.737444559913499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752fad3fb62a95%3A0xa9576c84a879d1fe!2zMTgwIENhbyBM4buXLCBDaMOhbmggSMawbmcsIEjhu5MgQ2jDrSBNaW5oIDcwMDAwLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1780078120581!5m2!1svi!2s" 
                            width="600" 
                            height="450" 
                            style={{border:0}} 
                            allowFullScreen 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                        </div>
                    </div>
                    <div className="content-container-right">

                        <form className="contact-form">
                            <input type="text" placeholder="Họ và tên" required/>
                            <input type="email" placeholder="Email" required/>
                            <input type="number" placeholder="Số điện thoại"/>
                            <textarea placeholder="Nội dung tin nhắn" required></textarea>
                            <button type="submit">Gửi yêu cầu</button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Contact;
