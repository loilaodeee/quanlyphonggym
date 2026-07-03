import QRCode from "react-qr-code";
import logo from "../assets/logo.png"; 
import { formatDate } from "../utils/date";

function PrintMemberCard({ member, password }) {

    const qrValue =
        `http://localhost:5174/login?member=${member.member_code}`;

    return (

        <div id="print-member-card">

            <div className="print-header">

                <img
                    src={logo}
                    alt="Logo"
                    className="print-logo"
                />

                <div>

                    <h1>ARIESS FITNESS</h1>

                    <h2>PHIẾU ĐĂNG KÝ HỘI VIÊN</h2>

                </div>

            </div>

            <hr />

            <table className="print-table">

                <tbody>

                    <tr>

                        <td>Họ và tên</td>

                        <td>{member.fullname}</td>

                    </tr>

                    <tr>

                        <td>Mã hội viên</td>

                        <td>{member.member_code}</td>

                    </tr>

                    <tr>

                        <td>Email</td>

                        <td>{member.email}</td>

                    </tr>

                    <tr>

                        <td>Số điện thoại</td>

                        <td>{member.phone}</td>

                    </tr>

                    <tr>

                        <td>Mật khẩu</td>

                        <td>{password}</td>

                    </tr>

                    <tr>

                        <td>Gói tập</td>

                        <td>{member.package_name}</td>

                    </tr>

                    <tr>

                        <td>Ngày bắt đầu</td>

                        <td>{formatDate(member.start_date)}</td>

                    </tr>

                    <tr>

                        <td>Ngày hết hạn</td>

                        <td>{formatDate(member.end_date)}</td>

                    </tr>

                    <tr>

                        <td>Thành tiền</td>

                        <td>

                            {member.price.toLocaleString()}đ

                        </td>

                    </tr>

                </tbody>

            </table>

            <div className="print-qr">

                <QRCode

                    value={qrValue}

                    size={120}

                />

                <p>

                    Quét QR để mở nhanh trang đăng nhập

                </p>

            </div>

            <div className="print-sign">

                <div>

                    <strong>

                        Nhân viên

                    </strong>

                    <div className="signature-line"/>

                </div>

                <div>

                    <strong>

                        Hội viên

                    </strong>

                    <div className="signature-line"/>

                </div>

            </div>

        </div>

    );

}

export default PrintMemberCard;