import { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";


function BossRouting() {
    const { user } = UserAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [role, setRole] = useState(null);

    useEffect(() => {    
        const fetchUporabniki = async () => {
            try {
                const response = await api.get('/uporabnik/vsi');
                setUsers(response.data);
            } catch (er) {
                console.log("Napaka pri pridobivanju uporabnikov", er);
            }
        }
    
        fetchPodjetja();
        fetchUporabniki();
    }, [])

    if (!user) {
        navigate("/login");
        return null;
    } else {
        for (let i = 0; i < users.length; i++) {
            if (users[i].email == user.email) {
                setRole(users[i].vloga);
        }
      }
    }

    if (role != "boss") {
        navigate("/profil");
        return null;
    }

    return <Outlet />;
}
export default BossRouting;