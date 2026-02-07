import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import {useParams} from 'react-router-dom';
import Breadcrumb from "../components/Breadcrump";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const {client_name} = useParams();
  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-40
          w-64 bg-white border-r border-gray-200 p-6
          h-full md:h-auto
          transform transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <h1 className="text-xl font-semibold text-[#7367f0] mb-8">
          {/* {client_name} */}
            Menu
        </h1>

        <nav className="flex flex-col gap-2">
          
          <NavLink
            to="myacc"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-medium transition
              ${isActive
                ? 'bg-[#7367f0]/10 text-[#7367f0]'
                : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            
            My Account
          </NavLink>

          <NavLink
            to="/clients"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-medium transition
              ${isActive
                ? 'bg-[#7367f0]/10 text-[#7367f0]'
                : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            
            Clients
          </NavLink>

          <NavLink
            to="billing"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-medium transition
              ${isActive
                ? 'bg-[#7367f0]/10 text-[#7367f0]'
                : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            Billing
          </NavLink>

          <NavLink
            to="addBill"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-medium transition
              ${isActive
                ? 'bg-[#7367f0]/10 text-[#7367f0]'
                : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            Add Bill
          </NavLink>
        </nav>
      </aside>

      {/* Content area */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Mobile top bar */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center">
          <button
            onClick={() => setOpen(true)}
            className="text-[#7367f0] font-medium"
          >
            ☰
          </button>
          <span className="ml-4 font-semibold text-gray-700">
            {/* {client_name} */}
            Menu
          </span>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8">
           {/* <Breadcrumb /> */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
