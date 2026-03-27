"use client";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Save } from "lucide-react";
import aaxios from "@/hooks/aaxios";
import { storage } from "@/hooks/storage";

const fieldConfig = [
  { key: "case_id", label: "Case Id", type: "text", required: true },
  { key: "case_name", label: "Case Name", type: "text", required: true },
  {
    key: "case_description",
    label: "Case Description",
    type: "textarea",
    required: true,
  },
  { key: "case_type", label: "Case Type", type: "text", required: true },
  { key: "case_status", label: "Case Status", type: "select", required: true },
  {
    key: "case_filing_date",
    label: "Case Filing Date",
    type: "date",
    required: true,
  },
  {
    key: "case_priority",
    label: "Case Priority",
    type: "select",
    required: true,
  },
];

const caseStatusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "closed", label: "Closed" },
];

const casePriorityOptions = [
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

function getInitialForm(searchParams, clients) {
  return {
    vendorId: getDefaultVendorId(searchParams, clients),
    case_id: searchParams.get("case_id") || "",
    case_name: searchParams.get("case_name") || "",
    case_description: searchParams.get("case_description") || "",
    case_type: searchParams.get("case_type") || "",
    case_status: searchParams.get("case_status") || "",
    case_filing_date: searchParams.get("case_filing_date") || getTodayDate(),
    case_priority: searchParams.get("case_priority") || "",
  };
}

function getTodayDate() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60 * 1000;
  return new Date(today.getTime() - timezoneOffset).toISOString().split("T")[0];
}

export default function AddMatterPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clients = useMemo(() => getStoredClients(), []);
  const [form, setForm] = useState(() => getInitialForm(searchParams, clients));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editingMatterId = searchParams.get("case_id")?.trim() || "";

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
      setError("Please select a client before saving the matter.");
      return;
    }

    const hasMissingField = fieldConfig.some(
      ({ key, required }) => required && !String(form[key] || "").trim()
    );

    if (hasMissingField) {
      setError("Please fill all matter fields before saving.");
      return;
    }

    const matterData = {
      vendorId: form.vendorId.trim(),
      case_id: form.case_id.trim(),
      case_name: form.case_name.trim(),
      case_description: form.case_description.trim(),
      case_type: form.case_type.trim(),
      case_status: form.case_status.trim(),
      case_filing_date: form.case_filing_date,
      case_priority: form.case_priority.trim(),
    };

    setIsSubmitting(true);

    try {
      if (isEditing && editingMatterId) {
        await aaxios.put(`/matters/${encodeURIComponent(editingMatterId)}`, {
          ...matterData,
          updatedAt: new Date(),
        });
      } else {
        await aaxios.post("/matters", {
          ...matterData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      navigate("/dashboard/matters");
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "save"} matter details.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-[linear-gradient(180deg,#f8f8ff_0%,#f5f7fb_45%,#eef2f7_100%)] p-6 md:p-8">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7367f0]">
              Matter Form
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">
              {isEditing ? "Edit Matter" : "Add Matter"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              {isEditing
                ? "Update the selected matter and save the latest case details to your backend."
                : "Save a matter to the backend using the fields required by your matter API."}
            </p>
          </div>

          <Link
            to="/dashboard/matters"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            Back to matters
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
                    {(field.key === "case_status"
                      ? caseStatusOptions
                      : casePriorityOptions
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
              ? `${isEditing ? "Updating" : "Saving"} matter...`
              : `${isEditing ? "Update" : "Save"} matter`}
          </button>
        </form>
      </div>
    </div>
  );
}
