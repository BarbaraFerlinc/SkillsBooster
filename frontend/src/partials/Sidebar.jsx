import React, { useState, useEffect, useRef, useCallback } from 'react';
import space from "../images/space-svgrepo-com.png";
import { UserAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import DomainList from "../pages/Domain/DomainList.jsx";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [domains, setDomains] = useState([]);
  const [showAddDomainCard, setShowAddDomainCard] = useState(false);
  const [newDomain, setNewDomain] = useState({ name: '', description: '', key_skills: '' });
  const [errors, setErrors] = useState({});
  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true');

  const { user } = UserAuth();

  const trigger = useRef(null);
  const sidebar = useRef(null);
  const addDomainCardRef = useRef(null);

  useEffect(() => {
    if (user) {
      const userEmail = user.email;

      api.post('/user/id', { id: userEmail })
          .then(res => {
            const profile = res.data;
            setCurrentUser(profile);
          })
          .catch(err => {
            console.error(err);
          });
    }
  }, [user]);

  useEffect(() => {
    if (currentUser) {
      switch (currentUser.role) {
        case "manager":
          fetchDomainsForOwner(currentUser);
          break;
        case "employee":
          fetchDomainsForUser(currentUser);
          break;
        case "admin":
          setDomains(null);
          break;
        default:
          setDomains(null);
      }
    }
  }, [currentUser, showAddDomainCard]);

  const fetchDomainsForUser = async (user) => {
    try {
      const response = await api.post('/domain/user', { id: user.email });
      setDomains(response.data);
    } catch (er) {
      console.log("Error retrieving domains", er);
    }
  };

  const fetchDomainsForOwner = async (user) => {
    try {
      const response = await api.post('/domain/owner', { id: user.email });
      setDomains(response.data);
    } catch (er) {
      console.log("Error retrieving domains", er);
    }
  };

  const handleAddDomain = () => {
    setShowAddDomainCard(true);
  };

  const handleSubmitDomain = async () => {
    try {
      if (validateForm()){
        newDomain.owner = currentUser.email;
        await api.post('/domain/add', newDomain, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        setShowAddDomainCard(false);
      }
      
    } catch (er) {
      console.log("Error adding domain", er);
    }
  };

  const handleClickOutside = useCallback(
      (event) => {
        if (showAddDomainCard && addDomainCardRef.current && !addDomainCardRef.current.contains(event.target)) {
          setShowAddDomainCard(true);
        }
      },
      [showAddDomainCard]
  );

  useEffect(() => {
    if (showAddDomainCard) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showAddDomainCard, handleClickOutside]);

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
      localStorage.setItem('sidebar-expanded', sidebarExpanded);
      if (sidebarExpanded) {
        document.querySelector('body').classList.add('sidebar-expanded');
      } else {
        document.querySelector('body').classList.remove('sidebar-expanded');
      }
  }, [sidebarExpanded]);

  const validateForm = () => {
    let formErrors = {};
    let formIsValid = true;

    if (!newDomain.name) {
        formIsValid = false;
        formErrors["name"] = "Please add domain's name";
    }

    if (!newDomain.description) {
        formIsValid = false;
        formErrors["description"] = "Please add description";
    }
    
    if (!newDomain.key_skills) {
        formIsValid = false;
        formErrors["key_skills"] = "Please add key skills";
    }

    setErrors(formErrors);
    return formIsValid;
  }

  const handleCancel = () => {
    setShowAddDomainCard(false)
    setErrors({});
  }

  return (
      <div>
        <div
            className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
                sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden="true"
        ></div>

        <div
            id="sidebar"
            ref={sidebar}
            className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-slate-800 p-4 transition-all duration-200 ease-in-out ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-64'
            }`}
        >
          <div className="flex justify-between mb-10 pr-3 sm:px-2">
            <button
                ref={trigger}
                className="lg:hidden text-slate-500 hover:text-slate-400"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-controls="sidebar"
                aria-expanded={sidebarOpen}
            >
              <span className="sr-only">Close sidebar</span>
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
              </svg>
            </button>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src={space} alt="Icon" className="w-14 h-14 mr-2" />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-sm uppercase text-slate-500 font-semibold pl-3">
                <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                  •••
                </span>
                <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Domains</span>
              </h3>
              <ul className="mt-3">
                <li>
                  <DomainList domains={domains} />
                </li>
              </ul>
              {currentUser && currentUser.role === "manager" && (
                  <div className="flex items-center justify-between mt-4">
                    <button
                        onClick={handleAddDomain}
                        className="text-md font-medium ml-3 text-white lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                    >
                      Add Domain
                    </button>
                  </div>
              )}
              {showAddDomainCard && (
                  <div ref={addDomainCardRef} className="bg-white p-4 rounded shadow-md mt-4 relative">
                    <h4 className="text-lg font-semibold mb-2">Add New Domain</h4>
                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input
                          type="text"
                          className="border rounded p-2 w-full"
                          value={newDomain.name}
                          onChange={(e) => setNewDomain({ ...newDomain, name: e.target.value })}
                      />
                      <small className="text-red-500">{errors.name}</small>
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <input
                          type="text"
                          className="border rounded p-2 w-full"
                          value={newDomain.description}
                          onChange={(e) => setNewDomain({ ...newDomain, description: e.target.value })}
                      />
                      <small className="text-red-500">{errors.description}</small>
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-1">Key Skills</label>
                      <input
                          type="text"
                          className="border rounded p-2 w-full"
                          value={newDomain.key_skills}
                          onChange={(e) => setNewDomain({ ...newDomain, key_skills: e.target.value })}
                      />
                      <small className="text-red-500">{errors.key_skills}</small>
                    </div>
                    <div className="flex justify-end">
                      <button
                          onClick={handleCancel}
                          className="btn bg-red-500 text-white py-2 px-5 rounded mr-2"
                      >
                        Cancel
                      </button>
                      <button
                          onClick={handleSubmitDomain}
                          className="btn bg-green-500 text-white py-2 px-5 rounded mr-1"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
              )}
            </div>
          </div>

          <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
            <div className="px-3 py-2">
              <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
                <span className="sr-only">Expand / collapse sidebar</span>
                <svg className="w-6 h-6 fill-current sidebar-expanded:rotate-180" viewBox="0 0 24 24">
                  <path className="text-slate-400" d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z" />
                  <path className="text-slate-600" d="M3 23H1V1h2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Sidebar;
