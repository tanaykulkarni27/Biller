import Avatar from "@/components/Avatar";
import { useNavigate } from "react-router-dom";
const billingData = [
  {
    client: "Tanay",
    billName: "January Invoice",
    amount: "₹12,000",
    status: "paid",
  },
  {
    client: "Aarav",
    billName: "February Invoice",
    amount: "₹8,500",
    status: "pending",
  },
  {
    client: "Priya",
    billName: "Service Charges",
    amount: "₹15,200",
    status: "paid",
  },
];


export default function Billing() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        
        {/* Scroll container */}
        <div className="max-w-screen overflow-x-auto no-scrollbar">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Client</th>
                <th className="px-6 py-3 text-left">Billing Name</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">View</th>
              </tr>
            </thead>

            <tbody>
              {billingData.map((item, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <Avatar name={item.client} size={36} />
                    <span className="font-medium text-gray-700">
                      {item.client}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {item.billName}
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {item.amount}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>

                  <td className="px-6 py-4">
                    <button className="text-[#7367f0] font-medium hover:underline" onClick={()=>navigate('../bill')}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const isPaid = status === "paid";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
        ${isPaid
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
        }`}
    >
      {isPaid ? "Paid" : "Pending"}
    </span>
  );
}
