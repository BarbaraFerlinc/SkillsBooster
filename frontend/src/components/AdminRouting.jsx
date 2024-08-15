import { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import api from "../services/api";

function AdminRouting() {
    const { user } = UserAuth();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
          const userEmail = user.email;
    
          api.post('/user/id', { id: userEmail })
            .then(res => {
              const profile = res.data;
              setCurrentUser(profile);
              setLoading(false);
            })
            .catch(err => {
              console.error(err);
              setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate("/login");
            } else if (currentUser && currentUser.role !== "admin") {
                navigate("/profile");
            }
        }
    }, [user, currentUser, loading, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return <Outlet />;
}
export default AdminRouting;