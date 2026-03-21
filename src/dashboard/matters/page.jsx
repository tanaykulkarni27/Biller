import { BriefcaseBusiness, Search } from "lucide-react";

const matters = [
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
  { key: "caseType", label: "Case Type" },
  { key: "courtName", label: "Court Name" },
  { key: "status", label: "Status" },
  { key: "priority", label: "Priority" },
];

export default function MattersPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(115,103,240,0.14),_transparent_30%),linear-gradient(180deg,#f8f8ff_0%,#f5f7fb_45%,#eef2f7_100%)] p-6 md:p-8">
      <div className="mx-auto max-w-6xl min-w-0">
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

          <div className="inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm font-medium text-slate-600 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur">
            <Search size={16} className="text-[#7367f0]" />
            4 active matters
          </div>
        </div>

        <div className="max-w-full min-w-0 overflow-hidden rounded-[32px] border border-white/70 bg-white/85 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur">
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

          <div className="max-w-full min-w-0 overflow-x-auto">
            <div className="hidden min-w-[1120px] md:block">
              <div className="grid grid-cols-[1.2fr_2.4fr_1.6fr_1.5fr_1.7fr_1.4fr_1.1fr] border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {columns.map((column) => (
                  <div key={column.key} className="px-6 py-4">
                    {column.label}
                  </div>
                ))}
              </div>

              {matters.map((matter) => (
                <div
                  key={matter.caseId}
                  className="grid grid-cols-[1.2fr_2.4fr_1.6fr_1.5fr_1.7fr_1.4fr_1.1fr] items-center border-b border-slate-100 text-sm text-slate-700 transition hover:bg-[#7367f0]/[0.03]"
                >
                  <div className="px-6 py-5 font-semibold text-slate-900">
                    {matter.caseId}
                  </div>
                  <div className="px-6 py-5">{matter.title}</div>
                  <div className="px-6 py-5">{matter.clientName}</div>
                  <div className="px-6 py-5">{matter.caseType}</div>
                  <div className="px-6 py-5">{matter.courtName}</div>
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
                </div>
              ))}
            </div>

            <div className="space-y-4 p-4 md:hidden">
              {matters.map((matter) => (
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
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
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
