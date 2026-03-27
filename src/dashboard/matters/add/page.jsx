import { Link, useSearchParams } from "react-router-dom";

const fields = [
  { key: "caseId", label: "Case Id" },
  { key: "title", label: "Title" },
  { key: "clientName", label: "Client Name" },
  { key: "caseType", label: "Case Type" },
  { key: "courtName", label: "Court Name" },
  { key: "status", label: "Status" },
  { key: "priority", label: "Priority" },
];

export default function AddMatterPage() {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const hasPrefilledValues = fields.some(({ key }) => params?.[key]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8f8ff_0%,#f5f7fb_45%,#eef2f7_100%)] p-6 md:p-8">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7367f0]">
              Matter Form
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">
              {hasPrefilledValues ? "Edit Matter" : "Add Matter"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              This page is intentionally kept as an empty scaffold for the matter
              form. When you open it from edit, the current matter values are
              carried here so we can wire the real form next.
            </p>
          </div>

          <Link
            to="/dashboard/matters"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            Back to matters
          </Link>
        </div>

        <div className="mt-8 rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 p-6">
          <h2 className="text-lg font-semibold text-slate-900">Empty Page</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Replace this section with your actual add or edit matter form.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {fields.map(({ key, label }) => (
              <div
                key={key}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {label}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-700">
                  {params?.[key] || "No value yet"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
