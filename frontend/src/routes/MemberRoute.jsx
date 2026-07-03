import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function MemberRoute() {

    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (!user.member) {

        switch (user.role_id) {

            case 1:
                return <Navigate to="/admin" replace />;

            case 2:
                return <Navigate to="/employee" replace />;

            case 3:
                return <Navigate to="/trainer" replace />;

            default:
                return <Navigate to="/" replace />;
        }

    }

    return <Outlet/>;
}

export default MemberRoute;