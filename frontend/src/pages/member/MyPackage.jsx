import { useContext, useEffect, useState } from "react";
import SideBar from "../../components/SideBar";
import { AuthContext } from "../../contexts/AuthContext";
import { getMyPackage, getPackages } from "../../api/packageApi";
import background from "../../assets/background.png";
import "../../styles/member/Mypackage.css";
import { FaCheck } from "react-icons/fa";
import { formatDate } from "../../utils/date";
import { getPackageStatusBadge } from "../../utils/statusBadge";
import { renewPackagePayment } from "../../api/PaymentApi";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../../hooks/useDocumentTitle";

function MyPackage() {
    useDocumentTitle("Gói tập của tôi");

    const { user } = useContext(AuthContext);

    const [myPackage, setMyPackage] = useState(null);

    const [showRenewModal, setShowRenewModal] = useState(false);

    const [packages, setPackages] = useState([]);
    
    const [packageId, setPackageId] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    

    useEffect(() => {
        // if(!user?.member?.id){
        //     return null;
        // }
        async function loadData(){

            const [packageData,myData]=await Promise.all([
                getPackages(),
                getMyPackage()
            ]);
        
            setPackages(packageData);
        
            setMyPackage(myData);
        
        }

        loadData();

    }, [user]);

    const activePackage = myPackage?.activePackage;

    const waitingPackage = myPackage?.waitingPackage;

    const history = myPackage?.history || [];

    if (!activePackage && !waitingPackage) {
        return (
            <div className="my-package">
                <div className="my-package-sidebar">
                    <SideBar />
                </div>
                <div className="my-package-content">
                    <h1>GÓI TẬP CỦA TÔI</h1>
                    <p className="my-package-empty">Chưa đăng ký gói tập</p>
                </div>
            </div>
        );
    }

    const benefits =activePackage.description?activePackage.description.split("\n"):[];
    const selectedPackage =packages.find(
        p=>p.id===packageId
    );
    
    let startDate = null;

    let endDate = null;

    if(activePackage && selectedPackage){

        const oldEnd =
            new Date(activePackage.end_date);

        const today =
            new Date();

        if(oldEnd>today){

            startDate =
                new Date(oldEnd);

            startDate.setDate(
                startDate.getDate()+1
            );

        }

        else{

            startDate=today;

        }

        endDate =
            new Date(startDate);

        endDate.setMonth(

            endDate.getMonth()

            +

            selectedPackage.duration_month

        );

    }
    
    async function handleRenew(){

        if(!packageId) return;
    
        try{
    
            setLoading(true);
    
            const result =
                await renewPackagePayment(packageId);
    
            navigate(
                `/checkout/${result.payment_id}?type=renew-package`
            );
    
        }
        catch(error){
    
            console.log(error);
    
        }
        finally{
    
            setLoading(false);
    
        }
    
    }

    return (

        <div className="my-package">
            <div className="my-package-sidebar">
                <SideBar />
            </div>

            <div className="my-package-content">
                <h1>GÓI TẬP CỦA TÔI</h1>
                <div className="my-package-wrapper">

                    <div className="my-package-card">

                        <div className="my-package-header">

                            <h2>{activePackage.package_name}</h2>

                            <span className={getPackageStatusBadge(activePackage.status)}>
                                {activePackage.status==="active"?"Đang hoạt động":"Đã hết hạn"}
                            </span>

                        </div>

                        <img
                            src={background}
                            alt=""
                            className="package-image"
                        />

                        <div className="package-info-row">

                            <span>Ngày bắt đầu</span>

                            <strong>{formatDate(activePackage.start_date)}</strong>

                        </div>

                        <div className="package-info-row">

                            <span>Ngày hết hạn</span>

                            <strong>{formatDate(activePackage.end_date)}</strong>

                        </div>

                        <div className="package-info-row">

                            <span>Còn lại</span>

                            <strong className="remaining">
                                {activePackage.remaining_days} ngày
                            </strong>

                        </div>

                        <div className="package-info-row">

                            <span>Giá gói</span>

                            <strong>
                                {activePackage.price.toLocaleString("vi-VN")}đ
                            </strong>

                        </div>

                        <button
                            className="renew-btn"
                            disabled={waitingPackage}
                            onClick={()=>setShowRenewModal(true)}
                        >
                            {
                                waitingPackage
                                ? "Đã có gói chờ kích hoạt"
                                : "Gia hạn gói tập"
                            }
                        </button>

                    </div>

                    {
                        waitingPackage && (

                            <div className="my-package-card waiting">

                                <div className="my-package-header">

                                    <h2>{waitingPackage.package_name}</h2>

                                    <span className={getPackageStatusBadge("waiting")}>
                                        Chờ kích hoạt
                                    </span>

                                </div>

                                <img
                                    src={background}
                                    alt=""
                                    className="package-image"
                                />

                                <div className="package-info-row">

                                    <span>Ngày bắt đầu</span>

                                    <strong>{formatDate(waitingPackage.start_date)}</strong>

                                </div>

                                <div className="package-info-row">

                                    <span>Ngày hết hạn</span>

                                    <strong>{formatDate(waitingPackage.end_date)}</strong>

                                </div>

                                <div className="package-info-row">

                                    <span>Còn chờ</span>

                                    <strong>

                                        {waitingPackage.waiting_days} ngày

                                    </strong>

                                </div>

                                <div className="package-info-row">

                                    <span>Giá gói</span>

                                    <strong>

                                        {waitingPackage.price.toLocaleString("vi-VN")}đ

                                    </strong>

                                </div>

                            </div>

                        )
                    }

                    <div className="my-benefit-card">

                        <h2>QUYỀN LỢI GÓI TẬP</h2>

                        {
                            benefits.map((item,index)=>(
                                <div
                                    className="benefit-item"
                                    key={index}
                                >
                                    <FaCheck className="benefit-icon"/> {item}
                                </div>
                            ))
                        }

                    </div>

                </div>
                <div className="package-history">

                    <h2>LỊCH SỬ GÓI TẬP</h2>

                    <table>

                        <thead>

                            <tr>

                                <th>Gói tập</th>

                                <th>Bắt đầu</th>

                                <th>Hết hạn</th>

                                <th>Trạng thái</th>

                            </tr>

                        </thead>

                        <tbody>

                            {
                                history.map(item => (

                                    <tr key={item.id}>

                                        <td>{item.package_name}</td>

                                        <td>{formatDate(item.start_date)}</td>

                                        <td>{formatDate(item.end_date)}</td>

                                        <td>
                                            <span className={getPackageStatusBadge(item.status)}>
                                            {
                                                item.status === "active"
                                                ? "Đang hoạt động"
                                                : item.status === "waiting"
                                                ? "Chờ kích hoạt"
                                                : "Đã hết hạn"
                                            }
                                            </span>
                                        </td>

                                    </tr>

                                ))
                            }

                        </tbody>

                    </table>

            </div>


            </div>
            {
                showRenewModal && (

                <div className="modal-overlay">

                    <div className="renew-package-modal">

                        <h2>

                            Gia hạn gói tập

                        </h2>

                        <select
                            value={packageId}
                            onChange={(e)=>setPackageId(Number(e.target.value))}
                        >

                            <option value="">

                                Chọn gói

                            </option>

                            {
                                packages.map(item=>(

                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >

                                        {item.package_name}

                                    </option>

                                ))
                            }

                        </select>

                        {
                            selectedPackage && (

                            <div>

                                <p>

                                    Thời hạn:

                                    {selectedPackage.duration_month}

                                    tháng

                                </p>

                                <p>

                                    Giá:

                                    {selectedPackage.price.toLocaleString("vi-VN")}đ

                                </p>

                            </div>

                            )
                            }

                        {
                            startDate && (

                                <>

                                    <p>

                                        Ngày bắt đầu:

                                        <strong>

                                            {formatDate(startDate)}

                                        </strong>

                                    </p>

                                    <p>

                                        Ngày hết hạn:

                                        <strong>

                                            {formatDate(endDate)}

                                        </strong>

                                    </p>

                                </>

                            )
                        }

                        {
                            activePackage &&
                            selectedPackage &&

                            <div className="renew-note">

                                Gói mới sẽ được kích hoạt sau khi gói hiện tại kết thúc.

                            </div>
                        }
                        <button
                            disabled={!selectedPackage || loading}
                            onClick={handleRenew}
                        >

                            {
                                loading
                                ? "Đang xử lý..."
                                : "Thanh toán"
                            }

                        </button>

                        <button
                            onClick={()=>{

                                setShowRenewModal(false);

                                setPackageId("");

                            }}
                        >

                            Đóng

                        </button>

                    </div>

                </div>

                )
                }
        </div>

    );

}

export default MyPackage;