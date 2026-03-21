import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";

const themeColor = "#7367f0";

export default function AddClientModal({ open, onClose, onSubmit, error, loading = false }) {
  const [name, setName] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [loading, onClose]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    if (!name || !vendorId || !address || !city || !pincode) return;

    onSubmit({
      name,
      vendorId,
      address,
      city,
      pincode,
    });

    // Reset
    setName("");
    setVendorId("");
    setAddress("");
    setCity("");
    setPincode("");
    // onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => !loading && onClose()}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 mx-4">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Add Client
          </h2>
          <button
            onClick={() => !loading && onClose()}
            disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
              className="mt-1 w-full px-4 py-2.5 rounded-lg border
              focus:outline-none focus:ring-1"
              style={{ '--tw-ring-color': themeColor }}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Address
            </label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 102, Anant Gaurav Chambers, MG Road"
              disabled={loading}
              className="mt-1 w-full px-4 py-2.5 rounded-lg border
              focus:outline-none focus:ring-1"
              style={{ '--tw-ring-color': themeColor }}
            />
          </div>

          {/* City + Pincode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                City
              </label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Pune"
                disabled={loading}
                className="mt-1 w-full px-4 py-2.5 rounded-lg border
                focus:outline-none focus:ring-1"
                style={{ '--tw-ring-color': themeColor }}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Pincode
              </label>
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="e.g. 411001"
                inputMode="numeric"
                disabled={loading}
                className="mt-1 w-full px-4 py-2.5 rounded-lg border
                focus:outline-none focus:ring-1"
                style={{ '--tw-ring-color': themeColor }}
              />
            </div>
          </div>
          <p className="text-red-500 text-sm">{error}</p>
          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => !loading && onClose()}
              disabled={loading}
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-w-[140px] items-center justify-center gap-2 px-5 py-2 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition disabled:cursor-not-allowed disabled:opacity-80"
              style={{ backgroundColor: themeColor }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Client"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
