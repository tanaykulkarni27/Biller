import { useEffect, useState } from "react";
import { X } from "lucide-react";

const themeColor = "#7367f0";

export default function AddClientModal({ open, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [address, setAddress] = useState("");

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !vendorId) return;

    onSubmit({
      name,
      vendorId,
      address,
    });

    // Reset
    setName("");
    setVendorId("");
    setAddress("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 mx-4">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Add Client
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Organization Name */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Organization Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ABC Pvt Ltd"
              required
              className="mt-1 w-full px-4 py-2.5 rounded-lg border
              focus:outline-none focus:ring-1"
              style={{ '--tw-ring-color': themeColor }}
            />
          </div>

          {/* Vendor ID */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Vendor ID
            </label>
            <input
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              placeholder="e.g. VND-1023"
              required
              className="mt-1 w-full px-4 py-2.5 rounded-lg border
              focus:outline-none focus:ring-1"
              style={{ '--tw-ring-color': themeColor }}
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Optional address"
              rows={3}
              className="mt-1 w-full px-4 py-2.5 rounded-lg border
              focus:outline-none focus:ring-1 resize-none"
              style={{ '--tw-ring-color': themeColor }}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition"
              style={{ backgroundColor: themeColor }}
            >
              Create Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
