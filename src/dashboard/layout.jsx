import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  Users,
  Receipt,
  PlusSquare,
  Calendar,
  BriefcaseBusiness,
  ListTodo,
  LogOut,
  Menu,
} from "lucide-react";

const navItems = [
  { to: "/dashboard/myacc", label: "Dashboard", icon: Home },
  { to: "/dashboard/clients", label: "Clients", icon: Users },
  { to: "/dashboard/matters", label: "Matters", icon: BriefcaseBusiness },
  { to: "/dashboard/tasks", label: "Tasks", icon: ListTodo },
  { to: "/dashboard/billing", label: "Invoice", icon: Receipt },
  { to: "/dashboard/addBill", label: "Add Invoice", icon: PlusSquare },
  { to: "/dashboard/calendar", label: "Calendar", icon: Calendar },
];

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const currentYear = new Date().getFullYear();
  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

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
          group/sidebar fixed z-40 h-full bg-white border-r border-gray-200
          transform transition-transform duration-300 md:transition-[width,padding] md:duration-200 md:ease-out md:will-change-[width]
          w-64 p-6
          md:static md:h-screen md:w-20 md:hover:w-64 md:px-3 md:py-6
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <h1 className="mb-8 flex items-center md:min-h-[32px] md:justify-center md:group-hover/sidebar:justify-start">
          <span className="text-xl font-semibold text-[#7367f0]">
            Menu
          </span>
        </h1>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center rounded-lg font-medium transition-colors md:min-h-[44px] md:justify-center md:px-0 md:group-hover/sidebar:justify-start md:group-hover/sidebar:px-4 px-4 py-2 gap-3 ${
                    isActive
                      ? "bg-[#7367f0]/10 text-[#7367f0]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />
                <span className="whitespace-nowrap md:pointer-events-none md:w-0 md:overflow-hidden md:opacity-0 md:translate-x-[-6px] md:transition-[opacity,transform,width] md:duration-150 md:ease-out md:group-hover/sidebar:w-[160px] md:group-hover/sidebar:opacity-100 md:group-hover/sidebar:translate-x-0">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-8 border-t border-gray-200 pt-2">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 md:min-h-[44px] md:justify-center md:px-0 md:group-hover/sidebar:justify-start md:group-hover/sidebar:px-4"
          >
            <LogOut size={18} className="shrink-0" />
            <span className="whitespace-nowrap md:pointer-events-none md:w-0 md:overflow-hidden md:opacity-0 md:translate-x-[-6px] md:transition-[opacity,transform,width] md:duration-150 md:ease-out md:group-hover/sidebar:w-[160px] md:group-hover/sidebar:opacity-100 md:group-hover/sidebar:translate-x-0">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Content area */}
      <div className="min-w-0 flex-1 flex min-h-screen flex-col md:h-screen">
        {/* Mobile top bar */}
        <header className="flex items-center border-b border-gray-200 bg-white p-4 md:hidden">
          <button
            onClick={() => setOpen(true)}
            type="button"
            aria-label="Open navigation menu"
            className="rounded-md p-2 text-[#7367f0] transition-colors hover:bg-[#7367f0]/10"
          >
            <Menu size={22} />
          </button>
        </header>

        {/* Main content */}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>

        <footer className="border-t border-gray-200 bg-white px-4 py-4 md:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
            <p>Copyright © {currentYear}. All rights reserved.</p>
            <Link
              to="/privacy-policy"
              className="font-medium text-[#7367f0] transition hover:underline"
            >
              Privacy Policy
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
