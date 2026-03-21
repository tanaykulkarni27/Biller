import { CalendarClock, CheckCircle2, CirclePlus, ClipboardList, TimerReset } from "lucide-react";

const tasks = [
  {
    id: "TSK-101",
    title: "Draft written statement for Acme matter",
    assignee: "Aarav Mehta",
    matter: "Acme Corp vs. Northfield Developers",
    dueDate: "24 Mar 2026",
    status: "In Progress",
    priority: "High",
  },
  {
    id: "TSK-102",
    title: "Prepare hearing bundle",
    assignee: "Nisha Kapoor",
    matter: "Priya Sharma Bail Petition",
    dueDate: "22 Mar 2026",
    status: "Pending",
    priority: "Urgent",
  },
  {
    id: "TSK-103",
    title: "Review contract annexures",
    assignee: "Rohan Jain",
    matter: "Vertex LLP Contract Dispute",
    dueDate: "28 Mar 2026",
    status: "Review",
    priority: "Medium",
  },
  {
    id: "TSK-104",
    title: "Compile prior orders",
    assignee: "Meera Sethi",
    matter: "Rao Family Property Appeal",
    dueDate: "30 Mar 2026",
    status: "Completed",
    priority: "Low",
  },
];

const statusClasses = {
  Pending: "bg-amber-100 text-amber-700",
  "In Progress": "bg-[#7367f0]/10 text-[#5b53d6]",
  Review: "bg-cyan-100 text-cyan-700",
  Completed: "bg-emerald-100 text-emerald-700",
};

const priorityClasses = {
  Urgent: "bg-rose-100 text-rose-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-sky-100 text-sky-700",
  Low: "bg-slate-100 text-slate-700",
};

export default function TasksPage() {
  const completedCount = tasks.filter((task) => task.status === "Completed").length;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(115,103,240,0.14),_transparent_30%),linear-gradient(180deg,#f8f8ff_0%,#f5f7fb_45%,#eef2f7_100%)] p-6 md:p-8">
      <div className="mx-auto max-w-6xl min-w-0">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
              Tasks
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Organize litigation work, assign deadlines, and keep every matter
              moving with a clear task pipeline.
            </p>
          </div>

          <button
            type="button"
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#5b53d6] via-[#7367f0] to-[#8c83ff] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(115,103,240,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(115,103,240,0.32)] focus:outline-none focus:ring-2 focus:ring-[#7367f0]/30"
          >
            <CirclePlus size={18} className="transition group-hover:rotate-90" />
            Add Task
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            icon={ClipboardList}
            label="Open Tasks"
            value={tasks.length}
            tint="bg-[#7367f0]/10 text-[#7367f0]"
          />
          <StatCard
            icon={TimerReset}
            label="Due This Week"
            value="3"
            tint="bg-amber-100 text-amber-700"
          />
          <StatCard
            icon={CheckCircle2}
            label="Completed"
            value={completedCount}
            tint="bg-emerald-100 text-emerald-700"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
          <div className="min-w-0 overflow-hidden rounded-[32px] border border-white/70 bg-white/85 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#7367f0]/10 p-3 text-[#7367f0]">
                  <ClipboardList size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Task Queue
                  </h2>
                  <p className="text-sm text-slate-500">
                    A focused view of current work across active matters.
                  </p>
                </div>
              </div>
            </div>

            <div className="max-w-full min-w-0 overflow-x-auto">
              <div className="hidden min-w-[1160px] md:block">
                <div className="grid grid-cols-[110px_minmax(260px,2.2fr)_170px_minmax(280px,2.4fr)_130px_150px_120px] border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <GridHeading label="Task Id" />
                  <GridHeading label="Title" />
                  <GridHeading label="Assignee" />
                  <GridHeading label="Matter" />
                  <GridHeading label="Due Date" />
                  <GridHeading label="Status" />
                  <GridHeading label="Priority" />
                </div>

                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="grid grid-cols-[110px_minmax(260px,2.2fr)_170px_minmax(280px,2.4fr)_130px_150px_120px] items-center border-b border-slate-100 text-sm text-slate-700 transition hover:bg-[#7367f0]/[0.03]"
                  >
                    <GridCell strong>{task.id}</GridCell>
                    <GridCell>{task.title}</GridCell>
                    <GridCell>{task.assignee}</GridCell>
                    <GridCell>{task.matter}</GridCell>
                    <GridCell>{task.dueDate}</GridCell>
                    <GridCell>
                      <Pill className={statusClasses[task.status]}>{task.status}</Pill>
                    </GridCell>
                    <GridCell>
                      <Pill className={priorityClasses[task.priority]}>{task.priority}</Pill>
                    </GridCell>
                  </div>
                ))}
              </div>

              <div className="space-y-4 p-4 md:hidden">
                {tasks.map((task) => (
                  <article
                    key={task.id}
                    className="rounded-[24px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Task Id
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {task.id}
                        </p>
                      </div>
                      <Pill className={priorityClasses[task.priority]}>{task.priority}</Pill>
                    </div>

                    <h3 className="mt-4 text-base font-semibold text-slate-900">
                      {task.title}
                    </h3>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <TaskField label="Assignee" value={task.assignee} />
                      <TaskField label="Due Date" value={task.dueDate} />
                      <TaskField label="Matter" value={task.matter} className="col-span-2" />
                      <div className="col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Status
                        </p>
                        <Pill className={`mt-2 ${statusClasses[task.status]}`}>{task.status}</Pill>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-700">
                  <CalendarClock size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Upcoming Deadlines
                  </h2>
                  <p className="text-sm text-slate-500">
                    Prioritize the most time-sensitive work first.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {tasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900">
                        {task.title}
                      </p>
                      <Pill className={priorityClasses[task.priority]}>{task.priority}</Pill>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{task.matter}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Due {task.dueDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,rgba(91,83,214,0.96),rgba(140,131,255,0.96))] p-6 text-white shadow-[0_20px_50px_rgba(91,83,214,0.24)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Workflow Note
              </p>
              <h3 className="mt-3 text-xl font-semibold">
                Keep hearings, drafts, and reviews in one timeline.
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/80">
                Use the task list to surface bottlenecks early and ensure every
                case has a clear next action before the next court date.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tint }) {
  return (
    <div className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] backdrop-blur">
      <div className="flex items-center gap-4">
        <div className={`rounded-2xl p-3 ${tint}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function GridHeading({ label }) {
  return <div className="px-6 py-4">{label}</div>;
}

function GridCell({ children, strong = false }) {
  return (
    <div className={`px-6 py-5 ${strong ? "font-semibold text-slate-900" : ""}`}>
      {children}
    </div>
  );
}

function TaskField({ label, value, className = "" }) {
  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-700">{value}</p>
    </div>
  );
}

function Pill({ children, className = "" }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}
