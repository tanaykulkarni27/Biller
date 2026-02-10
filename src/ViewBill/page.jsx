import { useLocation, useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import aaxios from "../hooks/aaxios";
import {
  ArrowLeft,
  Download,
  Edit3,
  Save,
  X,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
} from "lucide-react";

const themeColor = "#7367f0";

export default function ViewBill() {
  const [isEditing, setIsEditing] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();

  // if user refreshes page → state is lost
  useEffect(() => {
    if (!state?.invoice) {
      navigate(-1); // go back safely
    }
  }, [state, navigate]);

  if (!state?.invoice) return null;

  const { invoice } = state;
  // Example dynamic data - Columns can change
  const [billData, setBillData] = useState(invoice);

  // Extract keys dynamically for table headers
  const tableHeaders = Object.keys(billData.items[0]).filter(
    (key) => key !== "id",
  );

  const handleInputChange = (index, key, value) => {
    const updatedItems = [...billData.items];
    updatedItems[index][key] = value;
    setBillData({ ...billData, items: updatedItems });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPDF = async ()=>{
    try {
    const response = await aaxios.get(`/invoice/${billData.invoice_no}`, {
      responseType: "blob", // 🔥 IMPORTANT
    });

    // Create a blob URL
    const file = new Blob([response.data], {
      type: "application/pdf",
    });

    const fileURL = URL.createObjectURL(file);

    // Open in new tab
    window.open(fileURL, "_blank");

    // Optional cleanup (browser handles it, but safe)
    setTimeout(() => URL.revokeObjectURL(fileURL), 1000);

  } catch (err) {
    console.error("Failed to fetch PDF", err);
  }
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* TOP NAVIGATION & ACTIONS */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition font-medium"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition shadow-sm" onClick={getPDF}>
              <Download size={18} />
              Download PDF
            </button>

            {isEditing ? (
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition"
                >
                  <X size={18} /> Cancel
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition shadow-sm active:scale-95"
                  style={{ backgroundColor: themeColor }}
                >
                  <Save size={18} /> Save Changes
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition shadow-sm active:scale-95"
                style={{ backgroundColor: themeColor }}
              >
                <Edit3 size={18} /> Update Bill
              </button>
            )}
          </div>
        </div>

        {/* BILL OVERVIEW CARD */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-indigo-50 text-[#7367f0]">
                  <FileText size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">
                    {billData.invoice_no}
                  </h1>
                 <button
  disabled={!isEditing}
  onClick={() => {
    if (!isEditing) return;
    setBillData({
      ...billData,
      status: billData.status === "PAID" ? "PENDING" : "PAID",
    });
  }}
  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition
    ${getStatusStyle(billData.status)}
    ${isEditing ? "cursor-pointer hover:opacity-80" : "cursor-default"}
  `}
  title={isEditing ? "Click to change status" : ""}
>
  {billData.status === "PAID" ? (
    <span className="flex items-center gap-1">
      <CheckCircle size={14} /> Paid
    </span>
  ) : (
    <span className="flex items-center gap-1">
      <Clock size={14} /> Pending
    </span>
  )}
</button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-600 text-sm">
              <Calendar size={16} className="text-[#7367f0]" />
              <div>
                <p className="text-xs text-gray-400">Bill Date</p>

                {isEditing ? (
                  <input
                    type="date"
                    value={billData.date}
                    onChange={(e) =>
                      setBillData({ ...billData, date: e.target.value })
                    }
                    className="mt-1 px-2 py-1 rounded-md border text-sm
        focus:outline-none focus:ring-2 focus:ring-[#7367f0]"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{billData.date}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* DYNAMIC BILL TABLE */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {tableHeaders.map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {billData.items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    {tableHeaders.map((header) => (
                      <td key={header} className="px-6 py-4">
                        {isEditing ? (
                          <input
                            type="text"
                            value={item[header]}
                            onChange={(e) =>
                              handleInputChange(index, header, e.target.value)
                            }
                            className="w-full px-3 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-[#7367f0] focus:outline-none text-sm"
                            style={{ borderColor: "#e5e7eb" }}
                          />
                        ) : (
                          <span className="text-sm text-gray-700 font-medium">
                            {header === "rate"
                              ? `₹${item[header].toLocaleString()}`
                              : item[header]}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTALS SECTION */}
          <div className="p-6 bg-gray-50 flex justify-end">
            <div className="w-full sm:w-64 space-y-3">
              {/* <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">₹44,000</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tax</span>
                <span className="font-semibold text-gray-800">₹4,000</span>
              </div> */}
              <div className="h-px bg-gray-200 my-2"></div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-800">Total</span>
                <span style={{ color: themeColor }}>₹{billData.total_amount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
