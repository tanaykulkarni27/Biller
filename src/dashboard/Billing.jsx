import Avatar from "@/components/Avatar";

const billingData = [
  {
    client: "Tanay",
    billName: "January Invoice",
    amount: "₹12,000",
  },
  {
    client: "Aarav",
    billName: "February Invoice",
    amount: "₹8,500",
  },
  {
    client: "Priya",
    billName: "Service Charges",
    amount: "₹15,200",
  },
];

export default function Billing() {
  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        
        {/* 👇 Scroll container */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Client</th>
                <th className="px-6 py-3 text-left">Billing Name</th>
                <th className="px-6 py-3 text-left">Amount</th>
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

                  <td className="px-6 py-4">
                    <button className="text-[#7367f0] font-medium hover:underline">
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
