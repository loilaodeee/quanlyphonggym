import { formatDate } from "../../utils/date";

function TrainerMemberDetailModal({ member, onClose }) {
    return (
        <div
            className="trainer-modal-overlay"
            onClick={onClose}
        >
            <div
                className="trainer-member-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>Thông tin hội viên</h2>

                <div className="trainer-member-modal-head">
                    <div className="trainer-member-avatar-wrap">
                        <img
                            src={`http://localhost:3000${member.verify_photo}`}
                            className="trainer-member-avatar"
                            alt=""
                        />
                    </div>
                    <div className="trainer-member-modal-head-info">
                        <h3>{member.fullname}</h3>
                        <p>Mã HV: {member.member_code}</p>
                    </div>
                </div>

                <div className="trainer-member-section">
                    <h4>Thông tin cá nhân</h4>
                    <div className="trainer-member-row">
                        <span>Email</span>
                        <span>{member.email}</span>
                    </div>
                    <div className="trainer-member-row">
                        <span>SĐT</span>
                        <span>{member.phone}</span>
                    </div>
                    <div className="trainer-member-row">
                        <span>Giới tính</span>
                        <span>{member.gender}</span>
                    </div>
                    <div className="trainer-member-row">
                        <span>Ngày sinh</span>
                        <span>{formatDate(member.birthday)}</span>
                    </div>
                    <div className="trainer-member-row">
                        <span>Chiều cao</span>
                        <span>{member.height} cm</span>
                    </div>
                    <div className="trainer-member-row">
                        <span>Cân nặng</span>
                        <span>{member.weight} kg</span>
                    </div>
                    <div className="trainer-member-row">
                        <span>Địa chỉ</span>
                        <span>{member.address || "---"}</span>
                    </div>
                </div>

                <div className="trainer-member-section">
                    <h4>Gói tập gym</h4>
                    <div className="trainer-member-row">
                        <span>Gói tập</span>
                        <span>{member.package_name}</span>
                    </div>
                    <div className="trainer-member-row">
                        <span>Ngày hết hạn</span>
                        <span>{formatDate(member.end_date)}</span>
                    </div>
                </div>

                <div className="trainer-member-section">
                    <h4>Gói PT</h4>
                    <div className="trainer-member-row">
                        <span>Gói PT</span>
                        <span>{member.trainer_package_name}</span>
                    </div>
                    <div className="trainer-member-row">
                        <span>Đã tập</span>
                        <span>{member.used_sessions}/{member.total_sessions} buổi</span>
                    </div>
                </div>

                <button type="button" onClick={onClose}>
                    Đóng
                </button>
            </div>
        </div>
    );
}

export default TrainerMemberDetailModal;
