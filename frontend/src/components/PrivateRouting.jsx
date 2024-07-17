import { UserAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

function PrivateRouting() {
    const { user } = UserAuth();

    if (!user) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
}
export default PrivateRouting;
