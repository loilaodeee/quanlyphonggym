import { useContext, useEffect, useState } from "react";
import SideBar from "../../components/SideBar";
import { AuthContext } from "../../contexts/AuthContext";
import { getMyTrainerPackages } from "../../api/TrainerApi";

import "../../styles/member/MyTrainerPackage.css";
import { useNavigate } from "react-router-dom";
import { formatDate, formatDateTime } from "../../utils/date";
import useDocumentTitle from "../../hooks/useDocumentTitle";
function MyTrainerPackage() {

    useDocumentTitle("Gói PT của tôi");

    const { user } = useContext(AuthContext);

    const [packages, setPackages] = useState([]);
    const navigate=useNavigate();

    useEffect(() => {

        async function loadData() {

            const data = await getMyTrainerPackages();

            setPackages(data);

        }

        if (user?.member) {
            loadData();
        }

    }, [user]);

    return (

        <div className="my-pt">

            <div className="my-pt-sidebar">
                <SideBar />
            </div>

            <div className="my-pt-content">

                <h1>GÓI PT CỦA TÔI</h1>

                {
                    packages.length === 0 ?

                        <div className="empty">

                            Bạn chưa có gói PT nào

                        </div>

                        :

                        packages.map(item => (

                            <div
                                className="pt-card"
                                key={item.id}
                            >

                                <img
                                    src={`http://localhost:3000${item.trainer_avatar}`}
                                    className="pt-avatar"
                                />

                                <div className="pt-info">

                                    <h2>
                                        {item.trainer_name}
                                    </h2>

                                    <p>
                                        {item.specialty}
                                    </p>

                                    <p>
                                        {item.package_name}
                                    </p>

                                    <p>

                                        Đã tập:

                                        {" "}

                                        {item.used_sessions}

                                        /

                                        {item.total_sessions}

                                    </p>

                                    <p>

                                        Còn lại:

                                        {" "}

                                        {item.remaining_sessions} {" "}

                                        buổi

                                    </p>

                                    <div className="progress">

                                        <div

                                            className="progress-bar"

                                            style={{
                                                width:
                                                    `${item.used_sessions / item.total_sessions * 100}%`
                                            }

                                            }

                                        />

                                    </div>

                                    <p>

                                        Mua ngày:

                                        {" "}

                                        {formatDate(item.purchase_date)}

                                    </p>

                                </div>

                                <div className="pt-action">

                                    {

                                        item.status === "active" ?

                                            <>


                                                <button onClick={()=> navigate(`/member/pt-booking/${item.id}`)}>

                                                    Đặt lịch

                                                </button>

                                            </>

                                            :

                                            <button
                                                disabled
                                            >

                                                Đã hoàn thành

                                            </button>

                                    }

                                </div>

                            </div>

                        ))

                }

            </div>

        </div>

    );

}

export default MyTrainerPackage;