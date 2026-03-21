import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

// import { Eye } from "lucide-react";

function CalendarDay({ day, hasTask, taskName, handleViewTask }) {
  const [hoverSide, setHoverSide] = useState("right");

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
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
      className="group relative z-0 min-h-28 overflow-visible rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:z-30 hover:-translate-y-1 hover:border-[#7367f0]/35 hover:shadow-[0_16px_40px_rgba(115,103,240,0.14)]"
    >
      <div className="flex items-start justify-between">
        <span className="text-sm font-semibold text-slate-700">{day}</span>
        <span
          className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
            hasTask
              ? "bg-[#7367f0]/10 text-[#5f55e8]"
              : "bg-slate-100 text-slate-400"
          }`}
        >
          {hasTask ? "Task" : "Free"}
        </span>
      </div>

      {/* Hover Card */}
      <div
        className={`
          pointer-events-none absolute top-2 z-40 rounded-2xl border border-slate-200 bg-white/95 p-4 hidden opacity-0 shadow-[0_22px_50px_rgba(15,23,42,0.18)] backdrop-blur transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:block md:w-[250px]
          bg-red-500
          ${hoverSide === "right" ? "left-full ml-2" : "right-full mr-2"}
        `}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          {hasTask ? "Client Task" : "Availability"}
        </p>

        <p className="mt-2 text-sm font-semibold text-slate-800">{taskName}</p>

        <button
          type="button"
          onClick={() => handleViewTask(day)}
          className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
            hasTask
              ? "bg-[#7367f0] text-white hover:bg-[#6256ef]"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          <Eye size={15} />
          View Task
        </button>
      </div>
    </div>
  );
}

export default function BillingCalendar() {
  const navigate = useNavigate();
  const client = storage.get("client");
  const [currentDate, setCurrentDate] = useState(new Date());

  const tasksByDate = useMemo(() => {
    const clientLabel = client?.name || "Client";

    return {
      3: `${clientLabel} onboarding review`,
      8: `${clientLabel} invoice follow-up`,
      14: `${clientLabel} compliance check`,
      19: `${clientLabel} monthly billing`,
      24: `${clientLabel} payment reminder`,
      28: `${clientLabel} account summary`,
    };
  }, [client?.name, currentDate]);

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const handleViewTask = (day) => {
    navigate("/dashboard/billing", {
      state: {
        taskDate: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          day,
        ).toISOString(),
        taskName: tasksByDate[day],
      },
    });
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-28 rounded-2xl" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const taskName = tasksByDate[day] || "No task scheduled";
      const hasTask = Boolean(tasksByDate[day]);

      days.push(
        <CalendarDay
          key={day}
          day={day}
          hasTask={hasTask}
          taskName={taskName}
          handleViewTask={handleViewTask}
        />,
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
          </div>

          <button
            onClick={nextMonth}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="mb-3 grid grid-cols-7 gap-2 text-center text-sm font-semibold text-slate-500">
          {weekDays.map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
      </div>
    </div>
  );
}
