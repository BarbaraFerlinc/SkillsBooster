import { UserAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRouting() {
    const { user } = UserAuth();

    if (!user) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
}
export default PrivateRouting;
