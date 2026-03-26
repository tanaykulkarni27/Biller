import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Home, Users, Receipt, PlusSquare, Calendar, BriefcaseBusiness, ListTodo } from "lucide-react";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  }
  return (
    <div className="flex min-h-screen bg-gray-50 md:h-screen md:overflow-hidden">

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
          h-full md:h-screen
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
            to="/dashboard/myacc"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition
              ${isActive
                ? 'bg-[#7367f0]/10 text-[#7367f0]'
                : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            <Home size={18} />
            Dashboard
          </NavLink>
          <NavLink
            to="/dashboard/clients"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition
              ${isActive
                ? 'bg-[#7367f0]/10 text-[#7367f0]'
                : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            <Users size={18} />
            Clients
          </NavLink>
          <NavLink
            to="/dashboard/matters"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition
              ${isActive
                ? 'bg-[#7367f0]/10 text-[#7367f0]'
                : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            <BriefcaseBusiness size={18} />
            Matters
          </NavLink>
          <NavLink
            to="/dashboard/tasks"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition
              ${isActive
                ? 'bg-[#7367f0]/10 text-[#7367f0]'
                : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            <ListTodo size={18} />
            Tasks
          </NavLink>
          <NavLink
            to="/dashboard/billing"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition
              ${isActive
                ? 'bg-[#7367f0]/10 text-[#7367f0]'
                : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            <Receipt size={18} />
            Invoice
          </NavLink>
          <NavLink
            to="/dashboard/addBill"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition
              ${isActive
                ? 'bg-[#7367f0]/10 text-[#7367f0]'
                : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            <PlusSquare size={18} />
            Add Invoice
          </NavLink>
          <NavLink
            to="/dashboard/calendar"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition
              ${isActive
                ? 'bg-[#7367f0]/10 text-[#7367f0]'
                : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            <Calendar size={18} />
            Calendar
          </NavLink>
        </nav>

          {/* Logout at bottom */}
        <div className=" pt-2 border-t border-gray-200 mt-8 ">
          <button
            onClick={logout}
            className="w-full px-4 py-2 rounded-lg text-sm font-medium
            text-red-600 hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Content area */}
      <div className="min-w-0 flex-1 flex flex-col min-h-screen md:h-screen">

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
        <main className="min-w-0 flex-1 overflow-y-auto">
          {/*  p-4 md:p-8 */}
           {/* <Breadcrumb /> */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
