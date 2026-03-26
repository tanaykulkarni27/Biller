import Avatar from "@/components/Avatar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import aaxios from "../hooks/aaxios";
import Loader from "@/components/Loader";

export default function Billing() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        const res = await aaxios.get("/invoice");

        if (!isMounted) return;

        setData(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch invoices:", err);
        if (isMounted) {
          setData([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchInvoices();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-4 md:p-8">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden relative">
        {isLoading ? (
          <Loader />
        ) : data.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-gray-800">No invoices yet</h2>
            <p className="mt-2 text-sm text-gray-500">
              Add your first invoice to start tracking billing here.
            </p>
            <button
              onClick={() => navigate("/dashboard/addBill")}
              className="mt-6 rounded-lg bg-[#7367f0] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              Add Invoice
            </button>
          </div>
        ) : (
        <div className="max-w-screen overflow-x-auto no-scrollbar">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Client</th>
                <th className="px-6 py-3 text-left">Invoice No</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">View</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, index) =>(
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <Avatar name={item.clientName} size={36} />
                    <span className="font-medium text-gray-700">
                      {item.clientName}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {item.invoice_no}
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {item.total_amount}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>

                  <td className="px-6 py-4">
                    <button className="text-[#7367f0] font-medium hover:underline" 
                      onClick={()=>navigate('../bill', {
                      state: { invoice: item }
                    })}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const isPaid = status === "PAID";

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
