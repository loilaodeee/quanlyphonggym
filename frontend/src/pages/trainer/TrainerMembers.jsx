import { useEffect, useState } from "react";
import { getTrainerMemberDetail, getTrainerMembers } from "../../api/trainer/TrainerApi";
import SideBar from "../../components/SideBar";
import "../../styles/trainer/TrainerMembers.css";
import TrainerMemberDetailModal from "../../components/trainer/TrainerMemberDetailModal";
import { getTrainerMemberStatusBadge } from "../../utils/statusBadge";
import useDocumentTitle from "../../hooks/useDocumentTitle";
function TrainerMembers(){
    useDocumentTitle("Danh sách hội viên");

    const [keyword,setKeyword] =useState("");

    const [status,setStatus] =useState("all");

    const [members,setMembers] =useState([]);

    const [showDetail,setShowDetail] =useState(false);

    const [memberDetail,setMemberDetail] =useState(null);

    async function loadMembers(){

        const data =
            await getTrainerMembers(
                keyword,
                status
            );
    
        setMembers(data);
    
    }
    
    useEffect(()=>{
    
        loadMembers();
    
    },[
        keyword,
        status
    ]);

    async function handleDetail(id){

        const data =
            await getTrainerMemberDetail(id);
    
        setMemberDetail(data);
    
        setShowDetail(true);
    
    }

    return (

        <div className="trainer-members">
    
            <div className="trainer-members-sidebar">
    
                <SideBar/>
    
            </div>
    
            <div className="trainer-members-content">
    
                <div className="trainer-members-header">
    
                    <h2>
    
                        DANH SÁCH HỘI VIÊN
    
                    </h2>
    
                </div>
    
                <div className="trainer-members-filter">
    
                    <input
                        placeholder="Tìm mã hoặc tên hội viên"
                        value={keyword}
                        onChange={(e)=>
                            setKeyword(e.target.value)
                        }
                    />
    
                    <select
                        value={status}
                        onChange={(e)=>
                            setStatus(e.target.value)
                        }
                    >
    
                        <option value="all">
    
                            Tất cả
    
                        </option>
    
                        <option value="active">
    
                            Đang tập
    
                        </option>
    
                        <option value="completed">
    
                            Hoàn thành
    
                        </option>
    
                    </select>
    
                </div>
    
                <div className="trainer-members-table-wrapper">

                    <table className="trainer-members-table">

                        <thead>

                            <tr>

                                <th>Mã HV</th>

                                <th>Họ tên</th>

                                <th>Gói PT</th>

                                <th>Đã tập</th>

                                <th>Trạng thái</th>

                                <th>Thao tác</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                members.length===0 ?

                                <tr>

                                    <td
                                        colSpan={7}
                                        className="trainer-empty"
                                    >

                                        Chưa có hội viên

                                    </td>

                                </tr>

                                :

                                members.map(item=>

                                    <tr key={item.id}>
                                        <td>

                                            {item.member_code}

                                        </td>

                                        <td>

                                            {item.fullname}

                                        </td>

                                        <td>

                                            {item.package_name}

                                        </td>

                                        <td>

                                            {item.used_sessions}/{item.total_sessions}

                                        </td>

                                        <td>

                                            <span
                                                className={getTrainerMemberStatusBadge(item.status)}
                                            >

                                                {

                                                    item.status==="active"

                                                    ?

                                                    "Đang tập"

                                                    :

                                                    "Hoàn thành"

                                                }

                                            </span>

                                        </td>

                                        <td>

                                            <button
                                                className="trainer-detail-btn"
                                                onClick={()=>
                                                    handleDetail(item.id)
                                                }
                                            >

                                                Chi tiết

                                            </button>

                                        </td>

                                    </tr>

                                )

                            }

                        </tbody>

                    </table>

                </div>
    
            </div>

            {
                showDetail && memberDetail && (
                    <TrainerMemberDetailModal
                        member={memberDetail}
                        onClose={() => setShowDetail(false)}
                    />
                )
            }
        </div>
    )
}

export default TrainerMembers;