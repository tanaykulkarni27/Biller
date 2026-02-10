import Avatar from "@/components/Avatar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import aaxios from "../hooks/aaxios";
import {storage} from "../hooks/storage";
import Loader from "@/components/Loader";

export default function Billing() {
  const navigate = useNavigate();
  const [data,setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(()=>{
    setIsLoading(true);
    aaxios.get('/invoice',{params:{vendorId:storage.get('client').vendorId}}).then(res=>{
      setData(res.data);
    }).catch(err=>{});
    setIsLoading(false);
  },[]);
  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden relative">
        {isLoading ? (<Loader />):
        
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
                    <Avatar name={storage.get('client').name} size={36} />
                    <span className="font-medium text-gray-700">
                      {storage.get('client').name}
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
        </div>}

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
