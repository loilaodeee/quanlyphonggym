import { useEffect, useState } from "react";
import { getMembers } from "../../api/employee/MemberApi";
import { formatDate } from "../../utils/date";
import SideBar from "../../components/SideBar";
import "../../styles/employee/Members.css";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { getEmployeeMemberStatus } from "../../utils/statusBadge";
import useDocumentTitle from "../../hooks/useDocumentTitle";

function Members(){
    useDocumentTitle("Quản lý hội viên");
    const [members,setMembers]=useState([]);

    const [keyword,setKeyword]=useState("");

    const [status,setStatus]=useState("all");

    const navigate=useNavigate();

    const [page, setPage] = useState(1);
    const [total,setTotal]=useState(0);
    const limit = 10;

    const totalPages= Math.ceil(total/limit);

    const pages=[];

    if(totalPages<=7){

        for(let i=1;i<=totalPages;i++){
            pages.push(i);
        }

    }
    else{

        if(page<=4){

            pages.push(1,2,3,4,5,"...",totalPages);

        }

        else if(page>=totalPages-3){

            pages.push(
                1,
                "...",
                totalPages-4,
                totalPages-3,
                totalPages-2,
                totalPages-1,
                totalPages
            );

        }

        else{

            pages.push(
                1,
                "...",
                page-1,
                page,
                page+1,
                "...",
                totalPages
            );

        }

    }
    async function loadMembers(){

        const data=
            await getMembers(
                keyword,
                status,
                page,
                limit
            );
    
        setMembers(data.members);
        setTotal(data.total);
    
    }

    useEffect(()=>{

        const timer=
            setTimeout(loadMembers,300);
    
        return ()=>clearTimeout(timer);
    
    },[
        keyword,
        status,
        page
    ]);

    return(
        <div className="employee-members">
            <div className="employee-members-sidebar">
                <SideBar/>
            </div>
            

            <div className="employee-members-content">

                <h2>

                    QUẢN LÝ HỘI VIÊN

                </h2>
                <div className="member-toolbar">

                <input

                    placeholder="Tên hoặc mã hội viên"

                    value={keyword}

                    onChange={(e)=>{
                        setKeyword(e.target.value);
                        setPage(1);
                    }
                        
                    }
                    

                />

                <select

                    value={status}

                    onChange={(e)=>{
                        setStatus(e.target.value);
                        setPage(1);
                    }
                        
                    }

                >

                    <option value="all">

                        Tất cả

                    </option>

                    <option value="active">

                        Đang hoạt động

                    </option>

                    <option value="inactive">

                        Không hoạt động

                    </option>

                </select>

            </div>
                <table>

                    <thead>

                        <tr>

                            <th>Mã HV</th>

                            <th>Họ tên</th>

                            <th>Email</th>

                            <th>SĐT</th>

                            <th>Gói tập</th>

                            <th>Hết hạn</th>

                            <th>Trạng thái</th>
                            <th></th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            members.map(item=>(

                                <tr key={item.id}>

                                    <td>

                                        {item.member_code}

                                    </td>

                                    <td>

                                        {item.fullname}

                                    </td>

                                    <td>

                                        {item.email}

                                    </td>

                                    <td>

                                        {item.phone}

                                    </td>

                                    <td>

                                        {item.package_name||"---"}

                                    </td>

                                    <td>

                                        {
                                            item.end_date
                                            ? formatDate(item.end_date)
                                            : "---"
                                        }

                                    </td>

                                    <td>
                                        <span className={getEmployeeMemberStatus(item).className}>
                                            {getEmployeeMemberStatus(item).label}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            onClick={()=>
                                                navigate(`/employee/members/${item.id}`)
                                            }
                                        >
                                            Chi tiết
                                        </button>
                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

                <div className="pagination">

                    <button
                        disabled={page===1}
                        onClick={() => setPage(page-1)}
                        aria-label="Trang trước"
                    >
                        <FaChevronLeft />
                    </button>

                    {
                        pages.map((item,index)=>(

                            item==="..."
                        
                            ?
                        
                            <span
                                key={index}
                                className="page-dot"
                            >
                                ...
                            </span>
                        
                            :
                        
                            <button
                                key={item}
                                className={
                                    page===item
                                    ?
                                    "active-page"
                                    :
                                    ""
                                }
                                onClick={()=>setPage(item)}
                            >
                                {item}
                            </button>
                        
                        ))
                    }

                    <button
                        disabled={page===totalPages}
                        onClick={() => setPage(page+1)}
                        aria-label="Trang sau"
                    >
                        <FaChevronRight />
                    </button>

                </div>

            </div>

        </div>
    )
}

export default Members;