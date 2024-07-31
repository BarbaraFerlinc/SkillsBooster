import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Transition from '../utils/Transition';

import UserAvatar from '../images/user-avatar-32.png';

import api from '../services/api';
import { UserAuth } from '../context/AuthContext';

function DropdownProfile({ align }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { user } = UserAuth();

  const trigger = useRef(null);
  const dropdown = useRef(null);

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

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const handleDropdownToggle = () => {
    if (user) {
      setDropdownOpen(!dropdownOpen);
    }
  };

  return (
      <div className="relative inline-flex">
        <button
            ref={trigger}
            className="inline-flex justify-center items-center group"
            aria-haspopup="true"
            onClick={handleDropdownToggle}
            aria-expanded={dropdownOpen}
        >
          <img className="w-8 h-8 rounded-full" src={UserAvatar} width="32" height="32" alt="User" />
          <div className="flex items-center truncate">
          <span className="truncate ml-2 text-sm font-medium dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-slate-200">
            {currentUser?.ime_priimek}
          </span>
          </div>
        </button>

        <Transition
            className={`origin-top-right z-10 absolute top-full min-w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${
                align === 'right' ? 'right-0' : 'left-0'
            }`}
            show={dropdownOpen}
            enter="transition ease-out duration-200 transform"
            enterStart="opacity-0 -translate-y-2"
            enterEnd="opacity-100 translate-y-0"
            leave="transition ease-out duration-200"
            leaveStart="opacity-100"
            leaveEnd="opacity-0"
        >
          <div
              ref={dropdown}
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => setDropdownOpen(false)}
          >
            <ul>
              <li>
                <NavLink
                    className="font-medium text-md text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-200 flex items-center py-1 px-3"
                    to="/profile"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                    className="font-medium text-md text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-200 flex items-center py-1 px-3"
                    to="/reset"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  Reset Password
                </NavLink>
              </li>
              <li>
                <NavLink
                    className="font-medium text-md text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-200 flex items-center py-1 px-3"
                    to="/logout"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  Sign Out
                </NavLink>
              </li>
            </ul>
          </div>
        </Transition>
      </div>
  );
}

export default DropdownProfile;
