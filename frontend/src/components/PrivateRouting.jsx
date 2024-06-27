import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

function PrivateRouting() {
    const { user } = UserAuth();
    const navigate = useNavigate();

    if (!user) {
        navigate("/login");
        return null;
    }

    return <Outlet />;
}
export default PrivateRouting;