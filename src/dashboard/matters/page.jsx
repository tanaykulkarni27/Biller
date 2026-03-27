"use client";

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

const initialMatters = [
  {
    caseId: "MAT-2026-001",
    title: "Acme Corp vs. Northfield Developers",
    clientName: "Acme Corp",
    caseType: "Civil Litigation",
    courtName: "Delhi High Court",
    status: "In Progress",
    priority: "High",
  },
  {
    caseId: "MAT-2026-002",
    title: "Priya Sharma Bail Petition",
    clientName: "Priya Sharma",
    caseType: "Criminal",
    courtName: "Sessions Court",
    status: "Hearing Scheduled",
    priority: "Urgent",
  },
  {
    caseId: "MAT-2026-003",
    title: "Vertex LLP Contract Dispute",
    clientName: "Vertex LLP",
    caseType: "Commercial",
    courtName: "Commercial Court",
    status: "Drafting",
    priority: "Medium",
  },
  {
    caseId: "MAT-2026-004",
    title: "Rao Family Property Appeal",
    clientName: "Rao Family",
    caseType: "Property",
    courtName: "District Court",
    status: "Pending Review",
    priority: "Low",
  },
];

const priorityClasses = {
  Urgent: "bg-rose-100 text-rose-700",
  High: "bg-amber-100 text-amber-700",
  Medium: "bg-sky-100 text-sky-700",
  Low: "bg-emerald-100 text-emerald-700",
};

const statusClasses = {
  "In Progress": "bg-[#7367f0]/10 text-[#5b53d6]",
  "Hearing Scheduled": "bg-cyan-100 text-cyan-700",
  Drafting: "bg-slate-100 text-slate-700",
  "Pending Review": "bg-orange-100 text-orange-700",
};

const columns = [
  { key: "caseId", label: "Case Id" },
  { key: "title", label: "Title" },
  { key: "clientName", label: "Client Name" },
  { key: "status", label: "Status" },
  { key: "priority", label: "Priority" },
  { key: "caseType", label: "Case Type" },
  { key: "courtName", label: "Court Name" },
];

export default function MattersPage() {
  const [matters, setMatters] = useState(initialMatters);
  const [selectedMatterId, setSelectedMatterId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const selectedMatter = useMemo(
    () => matters.find((matter) => matter.caseId === selectedMatterId) ?? null,
    [matters, selectedMatterId]
  );

  const handleView = (matter) => {
    setSelectedMatterId(matter.caseId);
    setIsDrawerOpen(true);
    setOpenMenuId(null);
  };

  const handleDelete = (matterId) => {
    setMatters((currentMatters) => {
      const updatedMatters = currentMatters.filter(
        (matter) => matter.caseId !== matterId
      );

      if (selectedMatterId === matterId) {
        setSelectedMatterId(null);
        setIsDrawerOpen(false);
      }

      return updatedMatters;
    });

    setOpenMenuId(null);
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
              {matters.length} active matters
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
            <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-5">
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

            <div className="min-h-0 max-w-full min-w-0 flex-1 overflow-auto">
              <div className="hidden min-w-[1280px] md:block">
                <div className="grid grid-cols-[140px_minmax(220px,2.2fr)_minmax(150px,1.5fr)_minmax(140px,1.4fr)_minmax(170px,1.6fr)_minmax(140px,1.3fr)_minmax(110px,1fr)_88px] border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {columns.map((column) => (
                    <div
                      key={column.key}
                      className={`px-6 py-4 ${
                        column.key === "caseId" ? "whitespace-nowrap" : ""
                      }`}
                    >
                      {column.label}
                    </div>
                  ))}
                  <div className="sticky right-0 z-10 bg-slate-50/95 px-4 py-4 text-center shadow-[-10px_0_18px_rgba(248,250,252,0.95)]">
                    Actions
                  </div>
                </div>

                {matters.map((matter, index) => (
                  <div
                    key={matter.caseId}
                    className="grid grid-cols-[140px_minmax(220px,2.2fr)_minmax(150px,1.5fr)_minmax(140px,1.4fr)_minmax(170px,1.6fr)_minmax(140px,1.3fr)_minmax(110px,1fr)_88px] items-center border-b border-slate-100 text-sm text-slate-700 transition hover:bg-[#7367f0]/[0.03]"
                  >
                    <div className="whitespace-nowrap px-6 py-5 font-semibold text-slate-900">
                      {matter.caseId}
                    </div>
                    <div className="px-6 py-5">{matter.title}</div>
                    <div className="px-6 py-5">{matter.clientName}</div>
                    <div className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          statusClasses[matter.status]
                        }`}
                      >
                        {matter.status}
                      </span>
                    </div>
                    <div className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          priorityClasses[matter.priority]
                        }`}
                      >
                        {matter.priority}
                      </span>
                    </div>
                    <div className="px-6 py-5">{matter.caseType}</div>
                    <div className="px-6 py-5">{matter.courtName}</div>
                    <div className="sticky right-0 z-10 bg-white/95 px-4 py-5 shadow-[-10px_0_18px_rgba(255,255,255,0.95)]">
                      <MatterActions
                        matter={matter}
                        onView={handleView}
                        onDelete={handleDelete}
                        isOpen={openMenuId === matter.caseId}
                        onToggleMenu={() =>
                          setOpenMenuId((currentId) =>
                            currentId === matter.caseId ? null : matter.caseId
                          )
                        }
                        menuPlacement={
                          index >= matters.length - 2 ? "up-left" : "down-left"
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 p-4 md:hidden">
                {matters.map((matter, index) => (
                  <article
                    key={matter.caseId}
                    className="rounded-[24px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Case Id
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {matter.caseId}
                        </p>
                      </div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          priorityClasses[matter.priority]
                        }`}
                      >
                        {matter.priority}
                      </span>
                    </div>

                    <h3 className="mt-4 text-base font-semibold text-slate-900">
                      {matter.title}
                    </h3>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <MatterField label="Client Name" value={matter.clientName} />
                      <MatterField label="Case Type" value={matter.caseType} />
                      <MatterField label="Court Name" value={matter.courtName} />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Status
                        </p>
                        <span
                          className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            statusClasses[matter.status]
                          }`}
                        >
                          {matter.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <MatterActions
                        matter={matter}
                        onView={handleView}
                        onDelete={handleDelete}
                        isOpen={openMenuId === matter.caseId}
                        onToggleMenu={() =>
                          setOpenMenuId((currentId) =>
                            currentId === matter.caseId ? null : matter.caseId
                          )
                        }
                        menuPlacement={
                          index >= matters.length - 1 ? "up-left" : "down-left"
                        }
                      />
                    </div>
                  </article>
                ))}
              </div>
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
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-white/70 bg-white/95 p-6 shadow-[-24px_0_60px_rgba(15,23,42,0.18)] backdrop-blur transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedMatter ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7367f0]">
                  Matter Details
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">
                  {selectedMatter.title}
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
                  statusClasses[selectedMatter.status]
                }`}
              >
                {selectedMatter.status}
              </span>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  priorityClasses[selectedMatter.priority]
                }`}
              >
                {selectedMatter.priority}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <SidebarField label="Case Id" value={selectedMatter.caseId} />
              <SidebarField
                label="Client Name"
                value={selectedMatter.clientName}
              />
              <SidebarField label="Case Type" value={selectedMatter.caseType} />
              <SidebarField label="Court Name" value={selectedMatter.courtName} />
            </div>

            <Link
              to={`/dashboard/matters/add?${createMatterQuery(selectedMatter)}`}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7367f0] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(115,103,240,0.28)] transition hover:bg-[#6658ef]"
            >
              <Pencil size={16} />
              Edit matter
            </Link>
          </>
        ) : (
          <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center">
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
      ? "bottom-full right-full mb-2"
      : "right-full top-full mt-2";

  return (
    <div className={`relative flex justify-center ${isOpen ? "z-50" : "z-10"}`}>
      <button
        type="button"
        onClick={onToggleMenu}
        className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
        aria-label={`Open actions for ${matter.title}`}
      >
        <MoreHorizontal size={16} />
      </button>

      {isOpen && (
        <div
          className={`absolute z-[60] mr-2 min-w-[160px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_16px_36px_rgba(15,23,42,0.14)] ${menuPositionClasses}`}
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
            onClick={() => onDelete(matter.caseId)}
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

function MatterField({ label, value }) {
  return (
    <div>
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
