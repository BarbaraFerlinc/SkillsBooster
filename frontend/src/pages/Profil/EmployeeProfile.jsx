import React, { useEffect } from 'react';
import { Users } from "../../Data.jsx";
import api from '../../services/api.js';
import { UserAuth } from '../../context/AuthContext.jsx';

function EmployeeProfile({ userId }) {
    const user = Users.find(user => user.id === userId);

    const [currentUser, setCurrentUser] = useState(null);

    const { uporabnik } = UserAuth();

    useEffect(() => {
        if (user) {
          const uporabnikovEmail = user.email;
    
          api.post('/uporabnik/profil', { id: uporabnikovEmail })
            .then(res => {
              const profil = res.data;
              setCurrentUser(profil);
            })
            .catch(err => {
              console.error(err);
            });
        }
      }, [user]);

    console.log(currentUser);

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">My Domains</h2>
            {user.domains.map((domain, index) => {
                const progress = domain.progress; // Assuming domain object has a progress property
                return (
                    <div key={index} className="mb-4">
                        <h3 className="text-lg font-semibold">{domain.name}</h3>
                        <div className="flex items-center mb-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-indigo-600 h-2 rounded-full"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-700">{progress}%</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default EmployeeProfile;
