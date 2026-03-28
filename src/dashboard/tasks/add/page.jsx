"use client";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Save } from "lucide-react";
import aaxios from "@/hooks/aaxios";
import { storage } from "@/hooks/storage";
import Loader from "@/components/Loader";

const fieldConfig = [
  { key: "title", label: "Title", type: "text", required: true },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    required: true,
  },
  { key: "task_date", label: "Task Date", type: "date", required: true },
  { key: "status", label: "Status", type: "select", required: true },
  { key: "priority", label: "Priority", type: "select", required: true },
  { key: "case_id", label: "Case Id", type: "text", required: false },
];

const taskStatusOptions = [
  { value: "upcoming", label: "Upcoming" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Completed" },
];

const taskPriorityOptions = [
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

function getStoredClients() {
  const clients = storage.get("clients");
  return Array.isArray(clients) ? clients : [];
}

function getDefaultVendorId(searchParams, clients) {
  const vendorIdFromQuery = searchParams.get("vendorId") || "";
  if (vendorIdFromQuery) return vendorIdFromQuery;

  const selectedClient = storage.get("client");
  if (selectedClient?.vendorId) return selectedClient.vendorId;

  return clients[0]?.vendorId || "";
}

function getTodayDate() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60 * 1000;
  return new Date(today.getTime() - timezoneOffset).toISOString().split("T")[0];
}

function getInitialForm(searchParams, clients) {
  return {
    vendorId: getDefaultVendorId(searchParams, clients),
    task_id: searchParams.get("task_id") || "",
    title: searchParams.get("title") || "",
    description: searchParams.get("description") || "",
    task_date: searchParams.get("task_date") || getTodayDate(),
    status: normalizeTaskStatus(searchParams.get("status")),
    priority: normalizeTaskPriority(searchParams.get("priority")),
    case_id: searchParams.get("case_id") || "",
  };
}

export default function AddTaskPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clients = useMemo(() => getStoredClients(), []);
  const [form, setForm] = useState(() => getInitialForm(searchParams, clients));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editingTaskId = searchParams.get("task_id")?.trim() || "";

  const isEditing = useMemo(
    () => fieldConfig.some(({ key }) => searchParams.get(key)),
    [searchParams]
  );

  useEffect(() => {
    setForm(getInitialForm(searchParams, clients));
    setError("");
  }, [clients, searchParams]);

  const handleChange = (key, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.vendorId.trim()) {
      setError("Please select a client before saving the task.");
      return;
    }

    const hasMissingField = fieldConfig.some(
      ({ key, required }) => required && !String(form[key] || "").trim()
    );

    if (hasMissingField) {
      setError("Please fill all required task fields before saving.");
      return;
    }

    const taskData = {
      title: form.title.trim(),
      description: form.description.trim(),
      task_date: form.task_date,
      status: normalizeTaskStatus(form.status),
      priority: normalizeTaskPriority(form.priority),
      vendorId: form.vendorId.trim() || null,
      case_id: form.case_id.trim() || null,
    };

    setIsSubmitting(true);

    try {
      if (isEditing && editingTaskId) {
        await aaxios.put(`/tasks/${encodeURIComponent(editingTaskId)}`, {
          ...taskData,
          task_id: editingTaskId,
          updatedAt: new Date(),
        });
      } else {
        await aaxios.post("/tasks", {
          ...taskData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      navigate("/dashboard/tasks");
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "save"} task details.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-[linear-gradient(180deg,#f8f8ff_0%,#f5f7fb_45%,#eef2f7_100%)] p-6 md:p-8">
      {isSubmitting && <Loader />}

      <div className="mx-auto max-w-4xl rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7367f0]">
              Task Form
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">
              {isEditing ? "Edit Task" : "Add Task"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              {isEditing
                ? "Update the selected task and save the latest task details to your backend."
                : "Save a task to the backend using the fields required by your task API."}
            </p>
          </div>

          <Link
            to="/dashboard/tasks"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            Back to tasks
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            {fieldConfig.map((field) => (
              <div
                key={field.key}
                className={field.type === "textarea" ? "md:col-span-2" : ""}
              >
                <label
                  htmlFor={field.key}
                  className="text-sm font-semibold text-slate-700"
                >
                  {field.label}
                </label>

                {field.type === "textarea" ? (
                  <textarea
                    id={field.key}
                    value={form[field.key]}
                    onChange={(event) =>
                      handleChange(field.key, event.target.value)
                    }
                    rows={5}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#7367f0] focus:ring-4 focus:ring-[#7367f0]/10"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                ) : field.type === "select" ? (
                  <select
                    id={field.key}
                    value={form[field.key]}
                    onChange={(event) =>
                      handleChange(field.key, event.target.value)
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#7367f0] focus:ring-4 focus:ring-[#7367f0]/10"
                  >
                    <option value="">Select {field.label.toLowerCase()}</option>
                    {(field.key === "status"
                      ? taskStatusOptions
                      : taskPriorityOptions
                    ).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.key}
                    type={field.type}
                    value={form[field.key]}
                    onChange={(event) =>
                      handleChange(field.key, event.target.value)
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#7367f0] focus:ring-4 focus:ring-[#7367f0]/10"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )}
              </div>
            ))}

            <div>
              <label
                htmlFor="vendorId"
                className="text-sm font-semibold text-slate-700"
              >
                Client
              </label>
              <select
                id="vendorId"
                value={form.vendorId}
                onChange={(event) => handleChange("vendorId", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#7367f0] focus:ring-4 focus:ring-[#7367f0]/10"
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.vendorId || client.name} value={client.vendorId || ""}>
                    {client.name || client.vendorId || "Unnamed client"}
                  </option>
                ))}
              </select>
              {clients.length === 0 ? (
                <p className="mt-2 text-sm text-amber-600">
                  No clients found in storage. Log in again or add a client first.
                </p>
              ) : null}
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#7367f0] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(115,103,240,0.28)] transition hover:bg-[#6658ef] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSubmitting
              ? `${isEditing ? "Updating" : "Saving"} task...`
              : `${isEditing ? "Update" : "Save"} task`}
          </button>
        </form>
      </div>
    </div>
  );
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
