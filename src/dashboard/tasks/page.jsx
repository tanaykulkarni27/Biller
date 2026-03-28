"use client";

import { createElement, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarClock,
  CheckCircle2,
  CirclePlus,
  ClipboardList,
  Eye,
  MoreHorizontal,
  Pencil,
  TimerReset,
  Trash2,
  X,
} from "lucide-react";
import aaxios from "@/hooks/aaxios";
import { storage } from "@/hooks/storage";
import Loader from "@/components/Loader";

const statusClasses = {
  upcoming: "bg-amber-100 text-amber-700",
  in_progress: "bg-[#7367f0]/10 text-[#5b53d6]",
  review: "bg-cyan-100 text-cyan-700",
  completed: "bg-emerald-100 text-emerald-700",
};

const priorityClasses = {
  urgent: "bg-rose-100 text-rose-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-sky-100 text-sky-700",
  low: "bg-slate-100 text-slate-700",
};

const columns = [
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "status", label: "Status" },
  { key: "priority", label: "Priority" },
  { key: "task_date", label: "Due Date" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const vendorId = storage.get("client")?.vendorId || "";

  const selectedTask = useMemo(
    () => tasks.find((task) => task.task_id === selectedTaskId) ?? null,
    [tasks, selectedTaskId]
  );

  useEffect(() => {
    setIsFetching(true);
    setError("");

    aaxios
      .get("/tasks", {
        params: vendorId ? { vendorId } : undefined,
      })
      .then((response) => {
        const responseData = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];
        setTasks(responseData.map(normalizeTask));
      })
      .catch((fetchError) => {
        setError(fetchError.response?.data?.message || "Failed to fetch tasks.");
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [vendorId]);

  const completedCount = tasks.filter((task) => task.status === "completed").length;
  const dueThisWeekCount = tasks.filter(isDueThisWeek).length;
  const upcomingTasks = [...tasks]
    .sort((firstTask, secondTask) => {
      const firstDate = new Date(firstTask.task_date || 0).getTime();
      const secondDate = new Date(secondTask.task_date || 0).getTime();
      return firstDate - secondDate;
    })
    .slice(0, 3);

  const handleView = (task) => {
    setSelectedTaskId(task.task_id);
    setIsDrawerOpen(true);
    setOpenMenuId(null);
  };

  const handleDelete = async (task) => {
    try {
      setIsDeleting(true);
      setError("");

      await aaxios.delete(`/tasks/${encodeURIComponent(task.task_id)}`, {
        params: task.vendorId ? { vendorId: task.vendorId } : undefined,
        data: task.vendorId ? { vendorId: task.vendorId } : undefined,
      });

      setTasks((currentTasks) => {
        const updatedTasks = currentTasks.filter(
          (currentTask) => currentTask.task_id !== task.task_id
        );

        if (selectedTaskId === task.task_id) {
          setSelectedTaskId(null);
          setIsDrawerOpen(false);
        }

        return updatedTasks;
      });
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || "Failed to delete task.");
    } finally {
      setIsDeleting(false);
      setOpenMenuId(null);
    }
  };

  return (
    <div className="min-h-full overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(115,103,240,0.14),_transparent_30%),linear-gradient(180deg,#f8f8ff_0%,#f5f7fb_45%,#eef2f7_100%)] p-6 md:p-8">
      {(isFetching || isDeleting) && <Loader />}

      <div className="mx-auto flex max-w-7xl min-w-0 flex-col">
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

          <Link
            to="/dashboard/tasks/add"
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#5b53d6] via-[#7367f0] to-[#8c83ff] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(115,103,240,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(115,103,240,0.32)] focus:outline-none focus:ring-2 focus:ring-[#7367f0]/30"
          >
            <CirclePlus size={18} className="transition group-hover:rotate-90" />
            Add Task
          </Link>
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
            value={dueThisWeekCount}
            tint="bg-amber-100 text-amber-700"
          />
          <StatCard
            icon={CheckCircle2}
            label="Completed"
            value={completedCount}
            tint="bg-emerald-100 text-emerald-700"
          />
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.75fr)_minmax(280px,0.85fr)] xl:items-stretch">
            <div className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[32px] border border-white/70 bg-white/85 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur xl:h-full">
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

              <div className="relative max-w-full min-w-0 overflow-x-auto overflow-y-visible xl:min-h-0 xl:flex-1 xl:overflow-auto">
                {error ? (
                  <div className="m-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    {error}
                  </div>
                ) : !isFetching && tasks.length === 0 ? (
                  <div className="flex min-h-[320px] items-center justify-center px-6 text-center text-sm font-medium text-slate-500">
                    No tasks found yet. Use Add Task to create the first one.
                  </div>
                ) : (
                  <>
                    <div className="hidden min-w-[1040px] md:block">
                      <div className="grid grid-cols-[minmax(260px,2.4fr)_minmax(280px,2.6fr)_minmax(140px,1.4fr)_minmax(170px,1.6fr)_minmax(140px,1.3fr)_88px] border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {columns.map((column) => (
                          <div key={column.key} className="px-6 py-4">
                            {column.label}
                          </div>
                        ))}
                        <div className="sticky right-0 z-20 bg-slate-50/95 px-4 py-4 text-center shadow-[-10px_0_18px_rgba(248,250,252,0.95)]">
                          Actions
                        </div>
                      </div>

                      {tasks.map((task) => (
                        <div
                          key={task.task_id}
                          onClick={() => handleView(task)}
                          className="grid cursor-pointer grid-cols-[minmax(260px,2.4fr)_minmax(280px,2.6fr)_minmax(140px,1.4fr)_minmax(170px,1.6fr)_minmax(140px,1.3fr)_88px] items-center border-b border-slate-100 text-sm text-slate-700 transition hover:bg-[#7367f0]/[0.03]"
                        >
                          <div className="px-6 py-5 font-semibold text-slate-900">
                            {task.title}
                          </div>
                          <div className="px-6 py-5">{task.description}</div>
                          <div className="px-6 py-5">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                statusClasses[task.status] || "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {formatTaskStatus(task.status)}
                            </span>
                          </div>
                          <div className="px-6 py-5">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                priorityClasses[task.priority] || "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {formatTaskPriority(task.priority)}
                            </span>
                          </div>
                          <div className="px-6 py-5">{formatDisplayDate(task.task_date)}</div>
                          <div className="sticky right-0 z-20 bg-white/95 px-4 py-5 shadow-[-10px_0_18px_rgba(255,255,255,0.95)]">
                            <TaskActions
                              task={task}
                              onView={handleView}
                              onDelete={handleDelete}
                              isOpen={openMenuId === task.task_id}
                              onToggleMenu={() =>
                                setOpenMenuId((currentId) =>
                                  currentId === task.task_id ? null : task.task_id
                                )
                              }
                              menuPlacement="down-left"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 p-4 md:hidden">
                      {tasks.map((task) => (
                        <article
                          key={task.task_id}
                          onClick={() => handleView(task)}
                          className="cursor-pointer rounded-[24px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Due Date
                              </p>
                              <p className="mt-1 text-sm font-semibold text-slate-900">
                                {formatDisplayDate(task.task_date)}
                              </p>
                            </div>
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                priorityClasses[task.priority] || "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {formatTaskPriority(task.priority)}
                            </span>
                          </div>

                          <h3 className="mt-4 text-base font-semibold text-slate-900">
                            {task.title}
                          </h3>

                          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                            <TaskField
                              label="Description"
                              value={task.description}
                              className="col-span-2"
                            />
                            <TaskField
                              label="Case Id"
                              value={task.case_id || "Not linked"}
                            />
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                Status
                              </p>
                              <span
                                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                  statusClasses[task.status] || "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {formatTaskStatus(task.status)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-5">
                            <TaskActions
                              task={task}
                              onView={handleView}
                              onDelete={handleDelete}
                              isOpen={openMenuId === task.task_id}
                              onToggleMenu={() =>
                                setOpenMenuId((currentId) =>
                                  currentId === task.task_id ? null : task.task_id
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
                  {upcomingTasks.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 text-sm text-slate-500">
                      No upcoming tasks available.
                    </div>
                  ) : (
                    upcomingTasks.map((task) => (
                      <div
                        key={task.task_id}
                        className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-900">
                            {task.title}
                          </p>
                          <Pill className={priorityClasses[task.priority]}>
                            {formatTaskPriority(task.priority)}
                          </Pill>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                          {task.case_id ? `Case ${task.case_id}` : "No linked matter"}
                        </p>
                        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Due {formatDisplayDate(task.task_date)}
                        </p>
                      </div>
                    ))
                  )}
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

      {isDrawerOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[1px]"
          onClick={() => setIsDrawerOpen(false)}
          aria-label="Close task drawer overlay"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col overflow-hidden border-l border-white/70 bg-white/95 shadow-[-24px_0_60px_rgba(15,23,42,0.18)] backdrop-blur transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedTask ? (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7367f0]">
                    Task Details
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">
                    {selectedTask.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Opened from the 3-dot actions menu.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                  aria-label="Close task details"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Pill className={statusClasses[selectedTask.status]}>
                  {formatTaskStatus(selectedTask.status)}
                </Pill>
                <Pill className={priorityClasses[selectedTask.priority]}>
                  {formatTaskPriority(selectedTask.priority)}
                </Pill>
              </div>

              <div className="mt-6 space-y-4 pb-6">
                <SidebarField
                  label="Description"
                  value={selectedTask.description || "No description provided"}
                />
                <SidebarField
                  label="Task Date"
                  value={formatDisplayDate(selectedTask.task_date)}
                />
                <SidebarField
                  label="Vendor Id"
                  value={selectedTask.vendorId || "Not provided"}
                />
                <SidebarField
                  label="Case Id"
                  value={selectedTask.case_id || "Not linked"}
                />
              </div>
            </div>

            <div className="border-t border-slate-200/80 bg-white/95 px-6 py-5">
              <Link
                to={`/dashboard/tasks/add?${createTaskQuery(selectedTask)}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7367f0] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(115,103,240,0.28)] transition hover:bg-[#6658ef]"
              >
                <Pencil size={16} />
                Edit task
              </Link>
            </div>
          </>
        ) : (
          <div className="m-6 flex h-full min-h-[280px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center">
            <div className="rounded-2xl bg-[#7367f0]/10 p-4 text-[#7367f0]">
              <Eye size={22} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Select a task
            </h2>
            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
              Use the 3-dot actions menu and choose view to open task details here.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

function StatCard({ icon, label, value, tint }) {
  return (
    <div className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] backdrop-blur">
      <div className="flex items-center gap-4">
        <div className={`rounded-2xl p-3 ${tint}`}>
          {createElement(icon, { size: 20 })}
        </div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
      </div>
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

function Pill({ children, className = "" }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}

function TaskActions({
  task,
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
        onClick={(event) => {
          event.stopPropagation();
          onToggleMenu();
        }}
        className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
        aria-label={`Open actions for ${task.title}`}
      >
        <MoreHorizontal size={16} />
      </button>

      {isOpen && (
        <div
          className={`absolute z-[90] mr-2 min-w-[160px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_16px_36px_rgba(15,23,42,0.14)] ${menuPositionClasses}`}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onView(task);
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:bg-[#7367f0]/5 hover:text-[#5b53d6]"
          >
            <Eye size={14} />
            View
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(task);
            }}
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

function createTaskQuery(task) {
  return new URLSearchParams(task).toString();
}

function normalizeTask(task) {
  return {
    task_id: task.task_id || task.taskId || task.id || "",
    title: task.title || "",
    description: task.description || "No description provided",
    task_date: formatDateForInput(task.task_date || task.taskDate || ""),
    status: normalizeTaskStatus(task.status),
    priority: normalizeTaskPriority(task.priority),
    vendorId: task.vendorId || "",
    case_id: task.case_id || task.caseId || "",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

function normalizeTaskStatus(value) {
  const normalized = String(value || "").trim().toLowerCase();

  if (normalized === "in progress" || normalized === "in_progress") {
    return "in_progress";
  }

  if (normalized === "complete" || normalized === "completed") {
    return "completed";
  }

  if (normalized === "review") {
    return "review";
  }

  if (normalized === "upcoming" || normalized === "pending") {
    return "upcoming";
  }

  return "upcoming";
}

function normalizeTaskPriority(value) {
  const normalized = String(value || "").trim().toLowerCase();

  if (["urgent", "high", "medium", "low"].includes(normalized)) {
    return normalized;
  }

  return "medium";
}

function formatTaskStatus(value) {
  const labels = {
    upcoming: "Upcoming",
    in_progress: "In Progress",
    review: "Review",
    completed: "Completed",
  };

  return labels[value] || "Upcoming";
}

function formatTaskPriority(value) {
  const labels = {
    urgent: "Urgent",
    high: "High",
    medium: "Medium",
    low: "Low",
  };

  return labels[value] || "Medium";
}

function formatDisplayDate(value) {
  if (!value) return "Not provided";

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value;

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateForInput(value) {
  if (!value) return "";

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value;

  return parsedDate.toISOString().split("T")[0];
}

function isDueThisWeek(task) {
  if (task.status === "completed") return false;

  if (!task.task_date) return false;

  const dueDate = new Date(task.task_date);
  if (Number.isNaN(dueDate.getTime())) return false;

  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return dueDate >= start && dueDate <= end;
}
