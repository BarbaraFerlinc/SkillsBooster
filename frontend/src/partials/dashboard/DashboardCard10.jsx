import React, { useState } from 'react';

import {Users} from "../../Data.jsx";

function DashboardCard10() {


  const changeUserRole = (id, newRole) => {
    setUsers(Users.map(user => user.id === id ? { ...user, role: newRole } : user));
  };

  return (
      <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
        <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">Users</h2>
        </header>
        <div className="p-3">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              {/* Table header */}
              <thead className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50">
              <tr>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Email</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Role</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Change Role</div>
                </th>
              </tr>
              </thead>
              {/* Table body */}
              <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
              {
                Users.map(user => (
                    <tr key={user.id}>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left">{user.email}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left">{user.role}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left">
                          <select
                              value={user.role}
                              onChange={(e) => changeUserRole(user.id, e.target.value)}
                          >
                            <option value="admin">Admin</option>
                            <option value="boss">Boss</option>
                            <option value="employee">Employee</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                ))
              }
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}

export default DashboardCard10;
