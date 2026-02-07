import { useState } from "react";
import Avatar from "@/components/Avatar";
import {
  Calendar,
  Mail,
  MapPin,
  IndianRupee
} from "lucide-react";

const themeColor = "#7367f0";

export default function MyAccount() {
  const [filter, setFilter] = useState("1year");

  const stats = [
    { label: "Total Bills", value: 128 },
    { label: "Pending Bills", value: 14 },
    { label: "Total Billed Amount", value: "₹4,80,000" },
    { label: "Amount Received", value: "₹4,10,000" },
    { label: "Total Earned", value: "₹3,75,000" },
    { label: "Pending Amount", value: "₹70,000" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <h1 className="text-2xl font-bold text-gray-800">
            My Account
          </h1>

          {/* Filters */}
          <div className="flex gap-2 bg-white p-1 rounded-xl border">
            {[
              { id: "1month", label: "1 Month" },
              { id: "1quarter", label: "1 Quarter" },
              { id: "1year", label: "1 Year" },
            //   { id: "custom", label: "Custom" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition
                  ${
                    filter === f.id
                      ? "text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                style={{
                  backgroundColor: filter === f.id ? themeColor : "transparent",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row gap-6">
          <Avatar name="Tanay Kulkarni" size={72} />

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoItem icon={<Mail size={16} />} text="tanay@example.com" />
            <InfoItem icon={<MapPin size={16} />} text="Pune, Maharashtra, India" />
            <InfoItem icon={<Calendar size={16} />} text="Subscribed on: 12 Jan 2024" />
            <InfoItem icon={<Calendar size={16} />} text="Renewal Date: 12 Jan 2025" />
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition"
            >
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                <IndianRupee size={14} />
                {stat.label}
              </div>
              <div
                className="text-2xl font-bold"
                style={{ color: themeColor }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

/* Small reusable info row */
function InfoItem({ icon, text }) {
  return (
    <div className="flex items-center gap-3 text-gray-600 text-sm">
      <span className="text-[#7367f0]">{icon}</span>
      {text}
    </div>
  );
}
