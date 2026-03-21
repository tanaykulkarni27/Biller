import { useState } from "react";
import Avatar from "@/components/Avatar";
import {storage} from '@/hooks/storage';
import aaxios from '@/hooks/aaxios';
import Loader from '@/components/Loader';

import {
  ArrowLeft,
  Hash,
  MapPin,
  Building2,
  Trash2,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const themeColor = "#7367f0";

export default function ViewClient() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading,setLoading] = useState(false);
  const [client, setClient] = useState(storage.get('client'));

  const [form, setForm] = useState(client);
  const nav = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setForm(client);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setForm(client);
  };

  const handleSave = () => {
    setLoading(true);
    aaxios.put('/client/'+client.vendorId, form).then(res=>{});
    setLoading(false);
    setClient(form);
    setIsEditing(false);
  };

  const handleDelete = () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this client? This action cannot be undone."
    );

    if (!confirmDelete) return;
    setLoading(true);
    aaxios.delete('/client/'+client.vendorId).then(res=>{});
    setLoading(false);
    setClient(form);
    setIsEditing(false);
    storage.remove('client');
    nav('/dashboard/clients');
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6 md:p-0 m-4 md:m-8">
      {isLoading && <Loader />}
      <div className="max-w-5xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <button
            type="button"
            onClick={() => nav(-1)}
            className="inline-flex w-fit items-center gap-2 text-sm sm:text-base font-semibold transition hover:opacity-80"
            style={{ color: themeColor, background: "transparent" }}
          >
            <ArrowLeft size={18} />
            Go back
          </button>

          <div className="flex flex-col md:flex-row md:items-center gap-2 sm:gap-3 w-full md:w-auto">
            {!isEditing ? (
              <>
                <button
                  onClick={handleEdit}
                  className="flex items-center justify-center gap-2 px-3 sm:px-5 py-2 rounded-lg text-white text-sm sm:text-base font-medium shadow-sm transition active:scale-95 w-full md:w-auto"
                  style={{ backgroundColor: themeColor }}
                >
                  <Edit3 size={16} />
                  Edit Client
                </button>

                <button
                  onClick={handleDelete}
                  className="flex items-center justify-center gap-2 px-3 sm:px-5 py-2 rounded-lg text-white text-sm sm:text-base font-medium bg-red-500 hover:bg-red-600 transition shadow-sm active:scale-95 w-full md:w-auto"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center justify-center gap-2 px-3 sm:px-5 py-2 rounded-lg text-white text-sm sm:text-base font-medium w-full md:w-auto
                transition active:scale-95"
                style={{ backgroundColor: themeColor }}
                >
                  <Save size={16} />
                  Save
                </button>

                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 px-3 sm:px-5 py-2 rounded-lg border text-gray-700 text-sm sm:text-base hover:bg-gray-100 transition w-full md:w-auto"
                >
                  <X size={16} />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* CLIENT CARD */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Avatar name={client.name} size={140} />

            <div className="flex-1 space-y-4">
              {/* Client Name */}
              {!isEditing ? (
                <h2 className="text-xl font-semibold text-gray-800">
                  {client.name}
                </h2>
              ) : (
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2
                    ring-[0]
                    focus:outline-none
                    focus:border-[#7367f0]
                    focus:ring-1
                    focus:ring-[#7367f0]"
                  style={{
                    // borderColor: themeColor,
                  }}
                />
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Vendor ID - Static, no input/border */}
                <div className="text-sm">
                  <p className="text-gray-500">Vendor ID</p>
                  <p className="mt-1 text-gray-700 font-medium  py-2 rounded-lg">
                    {client.vendorId}
                  </p>
                </div>

                <EditableField
                  label="Address"
                  name="address"
                  value={form.address}
                  isEditing={isEditing}
                  onChange={handleChange}
                  themeColor={themeColor}
                />

                <EditableField
                  label="City"
                  name="city"
                  value={form.city}
                  isEditing={isEditing}
                  onChange={handleChange}
                  themeColor={themeColor}
                />

                <EditableField
                  label="Pincode"
                  name="pincode"
                  value={form.pincode}
                  isEditing={isEditing}
                  onChange={handleChange}
                  themeColor={themeColor}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



/* Editable field */
function EditableField({ label, name, value, isEditing, onChange, themeColor }) {
  return (
    <div className="text-sm">
      <p className="text-gray-500">{label}</p>
      {!isEditing ? (
        <p className="mt-1 text-gray-700 font-medium">{value}</p>
      ) : (
        <input
          name={name}
          value={value}
          onChange={onChange}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2
                    ring-[0]
                    focus:outline-none
                    focus:border-[#7367f0]
                    focus:ring-1
                    focus:ring-[#7367f0]"
          style={{
            // borderColor: themeColor,
          }}
        />
      )}
    </div>
  );
}
