import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import aaxios from "@/hooks/aaxios";
import { storage } from "@/hooks/storage";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function CalendarDay({ day, tasks, handleViewTask }) {
  const [hoverSide, setHoverSide] = useState("right");
  const hasTask = tasks.length > 0;
  const isCompletedDay = hasTask && tasks.every((task) => task.status === "completed");
  const primaryTaskLabel =
    tasks.length === 0
      ? "No activity scheduled"
      : isCompletedDay
        ? tasks.length === 1
          ? "Completed"
          : `${tasks.length} completed tasks`
        : tasks.length === 1
        ? tasks[0].title
        : `${tasks.length} tasks scheduled`;

  const handleMouseEnter = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const spaceRight = window.innerWidth - rect.right;

    if (spaceRight < 260) {
      setHoverSide("left");
    } else {
      setHoverSide("right");
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      className={`group relative z-0 flex min-h-28 flex-col overflow-visible rounded-2xl border p-3 shadow-sm transition hover:z-30 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(115,103,240,0.14)] ${
        isCompletedDay
          ? "border-emerald-200 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.10),_transparent_42%),linear-gradient(180deg,#fcfffd_0%,#f3fbf7_45%,#edf8f1_100%)] ring-1 ring-emerald-500/5 hover:border-emerald-300"
          : hasTask
          ? "border-[#7367f0]/20 bg-[radial-gradient(circle_at_top,_rgba(115,103,240,0.08),_transparent_42%),linear-gradient(180deg,#fcfcff_0%,#f7f8fe_45%,#f2f5fb_100%)] ring-1 ring-[#7367f0]/5 hover:border-[#7367f0]/35"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex flex-1 items-center justify-center">
        <span
          className={`text-3xl font-bold leading-none ${
            isCompletedDay ? "text-emerald-600" : hasTask ? "text-[#4f46d8]" : "text-slate-700"
          }`}
        >
          {day}
        </span>
      </div>

      <div className="flex justify-end">
        <span
          className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
            isCompletedDay
              ? "bg-emerald-500 text-white shadow-[0_8px_20px_rgba(16,185,129,0.24)]"
              : hasTask
              ? "bg-[#7367f0] text-white shadow-[0_8px_20px_rgba(115,103,240,0.28)]"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {isCompletedDay
            ? "Completed"
            : hasTask
              ? `${tasks.length} Task${tasks.length > 1 ? "s" : ""}`
              : "Open"}
        </span>
      </div>

      <div
        className={`
          pointer-events-none absolute top-2 z-40 hidden rounded-2xl border border-slate-200 bg-white/95 p-4 opacity-0 shadow-[0_22px_50px_rgba(15,23,42,0.18)] backdrop-blur transition duration-200 group-hover:block group-hover:pointer-events-auto group-hover:opacity-100 md:w-[250px]
          ${hoverSide === "right" ? "left-full ml-2" : "right-full mr-2"}
        `}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          {isCompletedDay ? "Completed Work" : hasTask ? "Scheduled Work" : "Day Status"}
        </p>

        <p className="mt-2 text-sm font-semibold text-slate-800">{primaryTaskLabel}</p>

        {hasTask ? (
          <div className="mt-3 space-y-2">
            {tasks.slice(0, 3).map((task) => (
              <div key={task.task_id} className="rounded-xl bg-slate-50 px-3 py-2">
                <p className="text-sm font-medium text-slate-700">{task.title}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {formatTaskStatus(task.status)} • {formatTaskPriority(task.priority)}
                </p>
              </div>
            ))}
            {tasks.length > 3 ? (
              <p className="text-xs text-slate-500">+{tasks.length - 3} more tasks</p>
            ) : null}
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => handleViewTask(tasks)}
          className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
            hasTask
              ? "bg-[#7367f0] text-white hover:bg-[#6256ef]"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          <Eye size={15} />
          {hasTask ? "View Tasks" : "View Tasks Page"}
        </button>
      </div>
    </div>
  );
}

export default function BillingCalendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const vendorId = storage.get("client")?.vendorId || "";

  useEffect(() => {
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

  const tasksByDate = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    return tasks.reduce((groupedTasks, task) => {
      if (!task.task_date) return groupedTasks;

      const taskDate = new Date(task.task_date);
      if (Number.isNaN(taskDate.getTime())) return groupedTasks;
      if (taskDate.getFullYear() !== year || taskDate.getMonth() !== month) {
        return groupedTasks;
      }

      const day = taskDate.getDate();
      if (!groupedTasks[day]) {
        groupedTasks[day] = [];
      }

      groupedTasks[day].push(task);
      return groupedTasks;
    }, {});
  }, [currentDate, tasks]);

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleViewTask = (dayTasks) => {
    navigate("/dashboard/tasks", {
      state: {
        selectedTaskIds: dayTasks.map((task) => task.task_id),
        taskDate: dayTasks[0]?.task_date || null,
      },
    });
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let index = 0; index < firstDay; index++) {
      days.push(<div key={`empty-${index}`} className="h-28 rounded-2xl" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <CalendarDay
          key={day}
          day={day}
          tasks={tasksByDate[day] || []}
          handleViewTask={handleViewTask}
        />
      );
    }

    return days;
  };

  return (
    <div className="m-4 md:m-8">
      <div className="rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#f8f9ff_100%)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Track scheduled tasks directly from your calendar.
            </p>
          </div>

          <button
            onClick={nextMonth}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {isFetching ? (
          <div className="flex min-h-[320px] items-center justify-center gap-3 text-sm font-medium text-[#5b53d6]">
            <Loader2 size={18} className="animate-spin" />
            Loading tasks...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        ) : (
          <>
            <div className="mb-3 grid grid-cols-7 gap-2 text-center text-sm font-semibold text-slate-500">
              {weekDays.map((day) => (
                <div key={day} className="py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
          </>
        )}
      </div>
    </div>
  );
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

function formatDateForInput(value) {
  if (!value) return "";

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value;

  return parsedDate.toISOString().split("T")[0];
}
