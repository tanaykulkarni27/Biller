import { useState } from "react";
import Avatar from "@/components/Avatar";
import {storage} from "@/hooks/storage";
import {
  Calendar,
  Mail,
  MapPin,
  IndianRupee
} from "lucide-react";
import { formatDateFromSeconds } from "../utils/utils";

const themeColor = "#7367f0";
const sampleClientBusiness = [
  { client: "Acme Pvt Ltd", pendingInr: 45000, receivablesInr: 200000 },
  { client: "BluePeak Solutions", pendingInr: 38500, receivablesInr: 140000 },
  { client: "Sunrise Traders", pendingInr: 72000, receivablesInr: 248000 },
  { client: "Nexus Retail", pendingInr: 16500, receivablesInr: 80000 },
];

const formatInr = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function MyAccount() {
  const [filter, setFilter] = useState("1year");
  const user = storage.get('user');
  const stats = storage.get('stats');
  const invoiceStatsConfig = [
  { key: "totalInvoice", label: "Total Invoices" },
  { key: "paidInvoice", label: "Paid Invoices" },
  { key: "pendingInvoice", label: "Pending Invoices" },
  { key: "totalAmount", label: "Total Amount" },
  { key: "amountReceived", label: "Amount Received" },
  { key: "amountPending", label: "Amount Pending" },
];
  console.log(stats)
  return (
    // min-h-screen md:max-h-screen
    <div className=" bg-gray-50 p-8 md:p-0 ">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <h1 className="text-2xl font-bold text-gray-800">
            My Account
          </h1>

          {/* Filters */}
          <div className="flex gap-2 bg-white p-1 rounded-xl border invisible">
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
        {/* PROFILE CARD */}
<div className="bg-white rounded-2xl border border-gray-200 p-6">
  <div className="flex flex-col md:flex-row md:items-center gap-6">
    
    {/* Avatar */}
    <Avatar name={user.name} size={72} />

    {/* Name + Info */}
    <div className="flex-1 space-y-4">
      
      {/* Name + Renew */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-semibold text-gray-800">
          {user.name}
        </h2>

        {/* <button
          className="px-5 py-2 rounded-lg text-white font-medium transition shadow-sm hover:shadow-md active:scale-95"
          style={{ backgroundColor: themeColor }}
        >
          Renew Subscription
        </button> */}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoItem icon={<Mail size={16} />} text={user.email} />
        <InfoItem icon={<MapPin size={16} />} text={user.address} />
        <InfoItem icon={<Calendar size={16} />} text={`Joined on: ${formatDateFromSeconds(user.joinedAt._seconds)}`} />
        {/* <InfoItem icon={<Calendar size={16} />} text="Valid Until: 12 Jan 2025" /> */}
      </div>
    </div>
  </div>
</div>


        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {invoiceStatsConfig.map((statConfig, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition"
            >
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                <IndianRupee size={14} />
                {statConfig.label}
              </div>
              <div
                className="text-2xl font-bold"
                style={{ color: themeColor }}
              >
                {stats[statConfig.key]}
              </div>
            </div>
          ))}
        </div>

        {/* CLIENT BUSINESS TABLE */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Client Pending & Receivables
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium text-gray-600">
                    Client
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-600 text-right">
                    Pending (INR)
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-600 text-right">
                    Receivables (INR)
                  </th>
                </tr>
              </thead>
              <tbody>
                {sampleClientBusiness.map((row, index) => (
                  <tr key={row.client} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="px-6 py-4 text-sm text-gray-800">{row.client}</td>
                    <td className="px-6 py-4 text-sm font-medium text-right" style={{ color: themeColor }}>
                      {formatInr(row.pendingInr)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right" style={{ color: themeColor }}>
                      {formatInr(row.receivablesInr)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
