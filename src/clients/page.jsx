import React, { useEffect } from "react";
import Avatar from "@/components/Avatar";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Loader2, LogOut, Plus, Turtle } from "lucide-react";
import AddClient from "@/addClient/page";
import aaxios from "@/hooks/aaxios";
import { storage } from "@/hooks/storage";

export default function Clients() {
  const navigate = useNavigate();

  const [showModal, setShowModal] = React.useState(false);
  const [error, setError] = React.useState("");
  const [clients, setClients] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
    aaxios
      .get("/client")
      .then((res) => {
        setClients(res.data);
      })
      .catch((err) => {
        console.error("Error fetching clients:", err);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  const handleSelectClient = (client) => {
    storage.set("client", client);
    navigate("/dashboard/clients/view-client");
  };

  const handleModel = () => {
    if (isSubmitting) return;
    setError("");
    setShowModal(prev => !prev);
  };

  const handleAddClient = (client) => {
    setIsSubmitting(true);
    setError("");
    aaxios.post("/client", client).then(() => {
        setShowModal(false);
        setClients((prev) => [...prev, client]);
    }).catch(err => {
        console.error("Error adding client:", err);
        setError(err.response?.data?.message || "Failed to add client");  
    }).finally(() => {
        setIsSubmitting(false);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    storage.remove("client");
    navigate("/login");
  };

  const addClientButton = (
    <button
      onClick={handleModel}
      className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#5b53d6] via-[#7367f0] to-[#8c83ff] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(115,103,240,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(115,103,240,0.32)] focus:outline-none focus:ring-2 focus:ring-[#7367f0]/30"
    >
      <Plus size={17} className="transition group-hover:rotate-90" />
      <span>Add Client</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(115,103,240,0.14),_transparent_30%),linear-gradient(180deg,#f8f8ff_0%,#f5f7fb_45%,#eef2f7_100%)] p-6 md:p-8 bg-red-500 ">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          {!isFetching ? 
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
              {clients.length <= 0 ? "Create your first client" : "Select Client"}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              {clients.length <= 0
                ? "Set up a client profile to start managing billing, dashboards, and account details in one place."
                : "Choose a client to continue, or create a new one without leaving this workspace."}
            </p>
          </div> : <div></div>
          }

          <div className="flex items-center justify-end gap-3">
            {!isSubmitting && clients.length > 0 && addClientButton}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 shadow-sm transition hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              <LogOut size={16} className="text-red-500" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {isSubmitting && (
          <div className="mb-6 flex items-center justify-center gap-3 rounded-2xl border border-[#7367f0]/15 bg-white/90 px-4 py-3 text-sm font-medium text-[#5b53d6] shadow-sm">
            <Loader2 size={18} className="animate-spin" />
            Creating client, please wait...
          </div>
        )}

        {isFetching ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-[24px] border border-white/70 bg-white/80 shadow-sm"
              />
            ))}
          </div>
        ) : clients.length <= 0 ? (
          <div className="flex min-h-[55vh] flex-col items-center justify-center rounded-[32px] border border-dashed border-slate-300 bg-white/75 px-6 text-center shadow-[0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur">
            <div className="mb-5 rounded-full bg-[#7367f0]/10 p-4 text-[#7367f0]">
              <Plus size={28} />
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">
              No clients found yet. Create your first client to unlock billing and dashboard access.
            </p>
            {!isSubmitting && <div className="mt-8">{addClientButton}</div>}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {clients.map((client) => (
              <button
                key={client.name}
                onClick={() => handleSelectClient(client)}
                className="group relative overflow-hidden flex flex-col items-center gap-3 rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-1 hover:border-[#7367f0]/40 hover:shadow-[0_18px_38px_rgba(115,103,240,0.16)] focus:outline-none focus:ring-2 focus:ring-[#7367f0]/20"
              >
                <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-[linear-gradient(180deg,rgba(15,23,42,0)_0%,rgba(15,23,42,0.12)_100%)] opacity-0 transition-all duration-200 group-hover:opacity-100" />
                <div className="pointer-events-none absolute right-4 top-4 z-10 flex h-10 w-10 translate-y-1 items-center justify-center rounded-full bg-slate-900/85 text-white opacity-0 shadow-[0_10px_24px_rgba(15,23,42,0.22)] transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight size={18} />
                </div>
                <div className="relative z-0 transition-all duration-200 group-hover:scale-95 group-hover:opacity-80">
                  <Avatar name={client.name} size={48} />
                </div>
                <span className="relative z-0 text-sm font-semibold text-slate-700 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:text-[#5b53d6]">
                  {client.name}
                </span>
                <div className="pointer-events-none absolute inset-x-5 bottom-4 h-px origin-left scale-x-0 bg-gradient-to-r from-[#5b53d6] via-[#7367f0] to-transparent opacity-0 transition-all duration-200 group-hover:scale-x-100 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        )}

        {showModal && (
          <AddClient
            open={showModal}
            onClose={() => setShowModal(false)}
            onSubmit={handleAddClient}
            error={error}
            loading={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
