"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  Eye,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import aaxios from "@/hooks/aaxios";
import { storage } from "@/hooks/storage";

const priorityClasses = {
  high: "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700",
  Urgent: "bg-rose-100 text-rose-700",
  High: "bg-amber-100 text-amber-700",
  Medium: "bg-sky-100 text-sky-700",
  Low: "bg-emerald-100 text-emerald-700",
};

const statusClasses = {
  Pending: "bg-amber-100 text-amber-700",
  in_progress: "bg-[#7367f0]/10 text-[#5b53d6]",
  review: "bg-cyan-100 text-cyan-700",
  closed: "bg-slate-100 text-slate-700",
};

const columns = [
  { key: "case_id", label: "Case Id" },
  { key: "case_name", label: "Title" },
  { key: "case_status", label: "Status" },
  { key: "case_priority", label: "Priority" },
  { key: "case_type", label: "Case Type" },
];

export default function MattersPage() {
  const [matters, setMatters] = useState([]);
  const [selectedMatterId, setSelectedMatterId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const vendorId = storage.get("client")?.vendorId || "";

  const selectedMatter = useMemo(
    () => matters.find((matter) => matter.case_id === selectedMatterId) ?? null,
    [matters, selectedMatterId]
  );

  useEffect(() => {
    setIsFetching(true);
    aaxios
      .get("/matters", {
        params: vendorId ? { vendorId } : undefined,
      })
      .then((response) => {
        const responseData = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];
        setMatters(responseData.map(normalizeMatter));
      })
      .catch((fetchError) => {
        setError(
          fetchError.response?.data?.message || "Failed to fetch matters."
        );
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [vendorId]);

  const handleView = (matter) => {
    setSelectedMatterId(matter.case_id);
    setIsDrawerOpen(true);
    setOpenMenuId(null);
  };

  const handleDelete = async (matter) => {
    try {
      await aaxios.delete(`/matters/${encodeURIComponent(matter.case_id)}`, {
        params: matter.vendorId ? { vendorId: matter.vendorId } : undefined,
        data: matter.vendorId ? { vendorId: matter.vendorId } : undefined,
      });

      setMatters((currentMatters) => {
        const updatedMatters = currentMatters.filter(
          (currentMatter) => currentMatter.case_id !== matter.case_id
        );

        if (selectedMatterId === matter.case_id) {
          setSelectedMatterId(null);
          setIsDrawerOpen(false);
        }

        return updatedMatters;
      });
    } catch (deleteError) {
      setError(
        deleteError.response?.data?.message || "Failed to delete matter."
      );
    } finally {
      setOpenMenuId(null);
    }
  };

  return (
    <div className="h-full overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(115,103,240,0.14),_transparent_30%),linear-gradient(180deg,#f8f8ff_0%,#f5f7fb_45%,#eef2f7_100%)] p-6 md:p-8">
      <div className="mx-auto flex h-full max-w-7xl min-w-0 flex-col">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
              Matters
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Track active litigation matters, monitor priorities, and keep the
              legal team aligned on case progress.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm font-medium text-slate-600 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur">
              <Search size={16} className="text-[#7367f0]" />
              {isFetching ? "Loading matters..." : `${matters.length} active matters`}
            </div>

            <Link
              to="/dashboard/matters/add"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#7367f0] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(115,103,240,0.28)] transition hover:bg-[#6658ef]"
            >
              <Plus size={16} />
              Add matter
            </Link>
          </div>
        </div>

        <div className="relative min-h-0 flex-1">
          <div className="flex h-full max-w-full min-w-0 flex-col overflow-hidden rounded-[32px] border border-white/70 bg-white/85 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="relative z-0 flex items-center justify-between border-b border-slate-200/80 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#7367f0]/10 p-3 text-[#7367f0]">
                  <BriefcaseBusiness size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Matter List
                  </h2>
                  <p className="text-sm text-slate-500">
                    Litigation cases currently being handled by the firm.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 min-h-0 max-w-full min-w-0 flex-1 overflow-auto">
              {isFetching ? (
                <div className="flex h-full min-h-[320px] items-center justify-center gap-3 text-sm font-medium text-[#5b53d6]">
                  <Loader2 size={18} className="animate-spin" />
                  Loading matters...
                </div>
              ) : error ? (
                <div className="m-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                  {error}
                </div>
              ) : matters.length === 0 ? (
                <div className="flex h-full min-h-[320px] items-center justify-center px-6 text-center text-sm font-medium text-slate-500">
                  No matters found yet. Use Add matter to create the first one.
                </div>
              ) : (
                <>
              <div className="hidden min-w-[1040px] md:block">
                <div className="grid grid-cols-[140px_minmax(260px,2.4fr)_minmax(140px,1.4fr)_minmax(170px,1.6fr)_minmax(140px,1.3fr)_88px] border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {columns.map((column) => (
                    <div
                      key={column.key}
                      className={`px-6 py-4 ${
                        column.key === "case_id" ? "whitespace-nowrap" : ""
                      }`}
                    >
                      {column.label}
                    </div>
                  ))}
                  <div className="sticky right-0 z-20 bg-slate-50/95 px-4 py-4 text-center shadow-[-10px_0_18px_rgba(248,250,252,0.95)]">
                    Actions
                  </div>
                </div>

                {matters.map((matter) => (
                  <div
                    key={matter.case_id}
                    className="grid grid-cols-[140px_minmax(260px,2.4fr)_minmax(140px,1.4fr)_minmax(170px,1.6fr)_minmax(140px,1.3fr)_88px] items-center border-b border-slate-100 text-sm text-slate-700 transition hover:bg-[#7367f0]/[0.03]"
                  >
                    <div className="whitespace-nowrap px-6 py-5 font-semibold text-slate-900">
                      {matter.case_id}
                    </div>
                    <div className="px-6 py-5">{matter.case_name}</div>
                    <div className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          statusClasses[matter.case_status] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {formatCaseStatus(matter.case_status)}
                      </span>
                    </div>
                    <div className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          priorityClasses[matter.case_priority] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {formatCasePriority(matter.case_priority)}
                      </span>
                    </div>
                    <div className="px-6 py-5">{matter.case_type}</div>
                    <div className="sticky right-0 z-20 bg-white/95 px-4 py-5 shadow-[-10px_0_18px_rgba(255,255,255,0.95)]">
                      <MatterActions
                        matter={matter}
                        onView={handleView}
                        onDelete={handleDelete}
                        isOpen={openMenuId === matter.case_id}
                        onToggleMenu={() =>
                          setOpenMenuId((currentId) =>
                            currentId === matter.case_id ? null : matter.case_id
                          )
                        }
                        menuPlacement="down-left"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 p-4 md:hidden">
                {matters.map((matter) => (
                  <article
                    key={matter.case_id}
                    className="rounded-[24px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Case Id
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {matter.case_id}
                        </p>
                      </div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          priorityClasses[matter.case_priority] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {matter.case_priority}
                      </span>
                    </div>

                    <h3 className="mt-4 text-base font-semibold text-slate-900">
                      {matter.case_name}
                    </h3>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <MatterField
                        label="Description"
                        value={matter.case_description}
                        className="col-span-2"
                      />
                      <MatterField label="Case Type" value={matter.case_type} />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Status
                        </p>
                        <span
                          className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            statusClasses[matter.case_status] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {formatCaseStatus(matter.case_status)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <MatterActions
                        matter={matter}
                        onView={handleView}
                        onDelete={handleDelete}
                        isOpen={openMenuId === matter.case_id}
                        onToggleMenu={() =>
                          setOpenMenuId((currentId) =>
                            currentId === matter.case_id ? null : matter.case_id
                          )
                        }
                        menuPlacement="down-left"
                      />
                    </div>
                  </article>
                ))}
              </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {isDrawerOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[1px]"
          onClick={() => setIsDrawerOpen(false)}
          aria-label="Close matter drawer overlay"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col overflow-hidden border-l border-white/70 bg-white/95 shadow-[-24px_0_60px_rgba(15,23,42,0.18)] backdrop-blur transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedMatter ? (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7367f0]">
                    Matter Details
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">
                    {selectedMatter.case_name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Opened from the 3-dot actions menu.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                  aria-label="Close matter details"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    statusClasses[selectedMatter.case_status] || "bg-slate-100 text-slate-700"
                  }`}
                >
                  {formatCaseStatus(selectedMatter.case_status)}
                </span>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  priorityClasses[selectedMatter.case_priority] || "bg-slate-100 text-slate-700"
                }`}
              >
                {formatCasePriority(selectedMatter.case_priority)}
              </span>
            </div>

              <div className="mt-6 space-y-4 pb-6">
                <SidebarField
                  label="Vendor Id"
                  value={selectedMatter.vendorId || "Not provided"}
                />
                <SidebarField label="Case Id" value={selectedMatter.case_id} />
                <SidebarField label="Description" value={selectedMatter.case_description} />
                <SidebarField label="Case Type" value={selectedMatter.case_type} />
                <SidebarField
                  label="Filing Date"
                  value={selectedMatter.case_filing_date || "Not provided"}
                />
              </div>
            </div>
            <div className="border-t border-slate-200/80 bg-white/95 px-6 py-5">
              <Link
                to={`/dashboard/matters/add?${createMatterQuery(selectedMatter)}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7367f0] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(115,103,240,0.28)] transition hover:bg-[#6658ef]"
              >
                <Pencil size={16} />
                Edit matter
              </Link>
            </div>
          </>
        ) : (
          <div className="m-6 flex h-full min-h-[280px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center">
            <div className="rounded-2xl bg-[#7367f0]/10 p-4 text-[#7367f0]">
              <Eye size={22} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Select a matter
            </h2>
            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
              Use the 3-dot actions menu and choose view to open matter details
              here.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

function MatterActions({
  matter,
  onView,
  onDelete,
  isOpen,
  onToggleMenu,
  menuPlacement = "down-left",
}) {
  const menuPositionClasses =
    menuPlacement === "up-left"
      ? "bottom-full right-0 mb-2"
      : "right-0 top-full mt-2";

  return (
    <div className={`relative flex justify-center ${isOpen ? "z-[80]" : "z-10"}`}>
      <button
        type="button"
        onClick={onToggleMenu}
        className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
        aria-label={`Open actions for ${matter.case_name}`}
      >
        <MoreHorizontal size={16} />
      </button>

      {isOpen && (
        <div
          className={`absolute z-[90] mr-2 min-w-[160px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_16px_36px_rgba(15,23,42,0.14)] ${menuPositionClasses}`}
        >
          <button
            type="button"
            onClick={() => onView(matter)}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:bg-[#7367f0]/5 hover:text-[#5b53d6]"
          >
            <Eye size={14} />
            View
          </button>

          <button
            type="button"
            onClick={() => onDelete(matter)}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function MatterField({ label, value, className = "" }) {
  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-700">{value}</p>
    </div>
  );
}

function SidebarField({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function createMatterQuery(matter) {
  return new URLSearchParams(matter).toString();
}

function formatCaseStatus(value) {
  const statusLabels = {
    Pending: "Pending",
    in_progress: "In Progress",
    review: "Review",
    closed: "Closed",
  };

  return statusLabels[value] || value || "Not provided";
}

function formatCasePriority(value) {
  const priorityLabels = {
    urgent: "Urgent",
    high: "High",
    medium: "Medium",
    low: "Low",
    Urgent: "Urgent",
    High: "High",
    Medium: "Medium",
    Low: "Low",
  };

  return priorityLabels[value] || value || "Not provided";
}

function normalizeMatter(matter) {
  return {
    vendorId: matter.vendorId || "",
    case_id: matter.case_id || matter.caseId || "",
    case_name: matter.case_name || matter.title || "",
    case_description:
      matter.case_description || matter.description || "No description provided",
    case_type: matter.case_type || matter.caseType || "",
    case_status: matter.case_status || matter.status || "",
    case_filing_date: formatDateForInput(
      matter.case_filing_date || matter.caseFilingDate || ""
    ),
    case_priority: matter.case_priority || matter.priority || "",
    createdAt: matter.createdAt,
    updatedAt: matter.updatedAt,
  };
}

function formatDateForInput(value) {
  if (!value) return "";
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value;
  return parsedDate.toISOString().split("T")[0];
}
