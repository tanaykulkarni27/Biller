import { useLocation, Link, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const themeColor = "#7367f0";

export default function Breadcrumb() {
  const location = useLocation();
  const { client_name } = useParams();

  const pathnames = location.pathname
    .split("/")
    .filter(Boolean);

  // ❌ Do not show breadcrumb on My Account
  if (pathnames.includes("myacc")) return null;

  // ❌ Hide if only at client root
  if (pathnames.length <= 1) return null;

  return (
    <nav className="hidden md:flex items-center text-sm text-gray-500 mb-6">
      <ol className="flex items-center gap-1">
        <li>
          <Link
            to="/clients"
            className="hover:text-[#7367f0] font-medium"
          >
            Clients
          </Link>
        </li>

        {pathnames.slice(1).map((segment, index) => {
          const to = "/" + pathnames.slice(0, index + 2).join("/");
          const isLast = index === pathnames.slice(1).length - 1;

          const label =
            segment === client_name
              ? decodeURIComponent(segment)
              : segment
                  .replace(/([A-Z])/g, " $1")
                  .replace(/[-_]/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase());

          return (
            <li key={to} className="flex items-center gap-1">
              <ChevronRight size={16} />
              {isLast ? (
                <span
                  className="font-semibold"
                  style={{ color: themeColor }}
                >
                  {label}
                </span>
              ) : (
                <Link
                  to={to}
                  className="hover:text-[#7367f0] font-medium"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
