import { useCallback, useContext, useEffect, useState } from "react";
import SideBar from "../../components/SideBar";
import { AuthContext } from "../../contexts/AuthContext";

import {getMyServices, getServices, requestIncludedService, updateServiceStatus} from "../../api/ServiceApi";

import "../../styles/member/Myservice.css";

import { formatDate } from "../../utils/date";
import { getServiceStatusBadge } from "../../utils/statusBadge";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useDocumentTitle from "../../hooks/useDocumentTitle";

function MyService() {
    useDocumentTitle("Dịch vụ của tôi");

    const { user } = useContext(AuthContext);

    const [tab, setTab] = useState("current");

    const [includedServices, setIncludedServices] =useState([]);

    const [purchasedServices, setPurchasedServices] =useState([]);
    const [usedServices, setUsedServices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [serviceType, setServiceType] = useState("");

    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedRegisterService, setSelectedRegisterService] = useState(null);

    const [availableServices, setAvailableServices] = useState([]);

    

    const navigate=useNavigate();
    const loadData = useCallback(async () => {
        const data=await getMyServices();
        const allService= await getServices();
        setIncludedServices(data.included);
        setPurchasedServices(
            data.purchased.filter(item=>item.status!=='used')
        )
        setUsedServices(
            data.purchased.filter(
                item => item.status=== "used"
            )
        );

        const usedIds = [
            ...data.included.map(i => i.service_id),
            ...data.purchased.map(i => i.service_id)
        ];
    
        setAvailableServices(
            allService.filter(
                service => !usedIds.includes(service.id)
            )
        );
    
    }, []);
    console.log("render MyService");
    useEffect(() => {
        if(!user?.member){
            return;
        }
       
        loadData();

    }, [user, loadData]);

    async function handleConfirmUse(){

        try{
    
            if(serviceType==="included"){
    
                const result =await requestIncludedService(selectedService.id);
    
                toast.success(result.message);
    
            }
            else{
    
                await updateServiceStatus(
                    selectedService.member_service_id
                );
    
                toast.success("Đã gửi yêu cầu sử dụng");
    
            }
    
            await loadData();
    
            setShowModal(false);
    
            setSelectedService(null);
    
            setServiceType("");
    
        }
    
        catch(error){
    
            toast.error(
                error.response?.data?.message
            );
    
        }
    
    }

    async function handleUseIncluded(item){
        try{   
            const result =await requestIncludedService(item.id);
    
            toast.success(result.message);
    
            loadData();
    
        }
    
        catch(error){
    
            toast.error(
                error.response?.data?.message
            );
    
        }
    
    }

    return (

        <div className="my-service">

            <div className="my-service-sidebar">

                <SideBar />

            </div>

            <div className="my-service-content">

                <h1>DỊCH VỤ CỦA TÔI</h1>

                <div className="service-tab">

                    <button

                        className={tab === "current" ? "active" : ""}

                        onClick={() => setTab("current")}

                    >

                        Dịch vụ

                    </button>

                    <button

                        className={tab === "used" ? "active" : ""}

                        onClick={() => setTab("used")}

                    >

                        Đã sử dụng

                    </button>

                </div>

                {

                    tab === "current"

                        ?

                        <>
                        {
                            includedServices.length>0 &&(
                                <>
                                    <h2 className="service-section-title">Dịch vụ được tặng theo gói</h2>

                                    {
                                        includedServices.map(item => (
                                            <div
                                                className="service-card"
                                                key={`included-${item.id}`}
                                            >
                                                <div>

                                                    <h2>{item.service_name}</h2>

                                                    <p>{item.description}</p>

                                                </div>

                                                <div className="service-action">

                                                    <span className="benefit-text">
                                                        {item.benefit_text}
                                                    </span>

                                                    <button
                                                        className="service-action-btn"
                                                        onClick={()=>{
                                                            setSelectedService(item);
                                                            setServiceType("included");
                                                            setShowModal(true);
                                                        }}
                                                    >
                                                        Sử dụng
                                                    </button>

                                                </div>

                                            </div>
                                        ))
                                    }
                                </>
                            )
                        }
                            
                        {
                            purchasedServices.length>0 &&(
                                <>
                                    <h2 className="service-section-title">Dịch vụ đã đăng ký</h2>

                                    {
                                        purchasedServices.map(item => (
                                            <div
                                                className="service-card"
                                                key={`purchase-${item.id}`}
                                            >
                                                <div>

                                                    <h2>{item.service_name}</h2>

                                                    <p>{item.description}</p>

                                                </div>

                                                <div className="service-action">

                                                    {
                                                        item.status === "pending" &&
                                                        (
                                                            <button
                                                                className="service-action-btn"
                                                                onClick={() => {
                                                                    setSelectedService(item);
                                                                    setServiceType("purchase");
                                                                    setShowModal(true);
                                                                }}
                                                            >
                                                                Sử dụng
                                                            </button>
                                                        )
                                                    }

                                                    {
                                                        item.status === "using" &&
                                                        (
                                                            <div className="service-status-group">

                                                                <p className="request-time">
                                                                    Yêu cầu lúc:
                                                                    {" "}
                                                                    {formatDateTime(
                                                                        item.request_use_time
                                                                    )}
                                                                </p>

                                                                <span className={getServiceStatusBadge("using")}>
                                                                    Chờ xác nhận
                                                                </span>

                                                            </div>
                                                        )
                                                    }

                                                </div>

                                            </div>
                                        ))
                                    }
                                </>
                            )
                        }

                        {
                            availableServices.length > 0 && (
                                <>
                                    <h2 className="service-section-title">
                                        Đăng ký thêm dịch vụ
                                    </h2>

                                    {
                                        availableServices.map(item => (
                                            <div
                                                className="service-card"
                                                key={item.id}
                                            >
                                                <div>

                                                    <h2>
                                                        {item.service_name}
                                                    </h2>

                                                    <p>
                                                        {item.description}
                                                    </p>

                                                </div>

                                                <div className="service-action">

                                                    <p className="service-price">

                                                        {item.price.toLocaleString()}đ

                                                    </p>

                                                    <button
                                                        className="service-action-btn"
                                                        onClick={() => {

                                                            setSelectedRegisterService(item);

                                                            setShowRegisterModal(true);

                                                        }}
                                                    >

                                                        Đăng ký

                                                    </button>

                                                </div>

                                            </div>
                                        ))
                                    }
                                </>
                            )
                        }
                            
                        </>
                        :
                        usedServices.length === 0

                            ?

                            <div className="service-empty">

                                Chưa có lịch sử sử dụng

                            </div>

                            :

                            usedServices.map(item => (

                                <div

                                    className="service-card"

                                    key={item.id}

                                >

                                    <div>

                                        <h2>

                                            {item.service_name}

                                        </h2>

                                        <p>

                                            Ngày mua: {formatDate(item.purchase_date)}

                                        </p>

                                        <p>

                                            Ngày sử dụng: {formatDate(item.used_date)}

                                        </p>

                                    </div>

                                    <div className="service-action">

                                        <span className={getServiceStatusBadge("used")}>
                                            Đã sử dụng
                                        </span>

                                    </div>

                                </div>

                            ))

                }

            </div>

            {

                showModal && (

                    <div

                        className="service-modal-overlay"

                        onClick={() => setShowModal(false)}

                    >

                        <div

                            className="service-modal"

                            onClick={(e) => e.stopPropagation()}

                        >

                            <h2>

                                XÁC NHẬN SỬ DỤNG

                            </h2>

                            <p>

                                Bạn có chắc muốn sử dụng

                                <strong>

                                    {" "}{selectedService?.service_name}

                                </strong>

                                ?

                            </p>

                            <p>

                                Sau khi xác nhận, hãy cung cấp mã Hội viên, nhân viên sẽ kiểm tra

                                và xác nhận tại quầy.

                            </p>

                            <div className="service-modal-btn">

                                <button

                                    className="cancel-btn"

                                    onClick={() =>{
                                        setShowModal(false);
                                        setSelectedService(null);
                                    } }

                                >

                                    Để sau

                                </button>

                                <button

                                    className="confirm-btn"

                                    onClick={handleConfirmUse}

                                >

                                    Xác nhận

                                </button>

                            </div>

                        </div>

                    </div>

                )

            }
            {
                showRegisterModal && (

                    <div
                        className="service-modal-overlay"
                        onClick={() => setShowRegisterModal(false)}
                    >

                        <div
                            className="service-modal"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <h2>

                                ĐĂNG KÝ DỊCH VỤ

                            </h2>

                            <p>

                                <strong>
                                    {selectedRegisterService?.service_name}
                                </strong>

                            </p>

                            <p>

                                Giá:

                                {" "}

                                {selectedRegisterService?.price.toLocaleString()}đ

                            </p>

                            <p>

                                Đơn vị:

                                {" "}

                                {selectedRegisterService?.unit}

                            </p>

                            <p>

                                Sau khi xác nhận bạn sẽ được chuyển
                                sang trang thanh toán.

                            </p>

                            <div className="service-modal-btn">

                                <button
                                    className="cancel-btn"
                                    onClick={() => {

                                        setShowRegisterModal(false);

                                        setSelectedRegisterService(null);

                                    }}
                                >

                                    Hủy

                                </button>

                                <button
                                    className="confirm-btn"
                                    onClick={() => {

                                        navigate(`/payment?type=service&id=${selectedRegisterService.id}`)

                                        console.log(
                                            selectedRegisterService
                                        );

                                    }}
                                >

                                    Xác nhận

                                </button>

                            </div>

                        </div>

                    </div>

                )
}

        </div>

    );

}

export default MyService;