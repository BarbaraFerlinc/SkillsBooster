import { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import api from "../services/api";

function BossRouting() {
    const { user } = UserAuth();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
          const uporabnikovEmail = user.email;
          console.log("user: ", uporabnikovEmail);
    
          api.post('/uporabnik/profil', { id: uporabnikovEmail })
            .then(res => {
              const profil = res.data;
              setCurrentUser(profil);
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
            } else if (currentUser && currentUser.vloga !== "boss") {
                navigate("/profile");
            }
        }
    }, [user, currentUser, loading, navigate]);

    // se pokaže okno za nalaganje
    if (loading) {
        return <div>Loading...</div>; // Ali kakšen drug indikator nalaganja
    }

    return <Outlet />;
}
export default BossRouting;