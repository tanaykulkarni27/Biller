import React from "react";
import Avatar from "@/components/Avatar";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import AddClient from "@/addClient/page";


const SampleSet = [
  'Aarav',
  'Tanay',
  'Rohit',
  'Ananya',
  'Priya',
  'Kunal',
  'Neha',
  'Rahul',
  'Sneha',
  'Vikram',
  // try empty [] to test no-client state
];

export default function Clients() {
  const navigate = useNavigate();

  const [showModal, setShowModal] = React.useState(false);

  const handleSelectClient = (name) => {
    navigate(`/dashboard/${encodeURIComponent(name)}`);
  };

  const handleModel = () => {
    // later: open modal or navigate to add-client page
    setShowModal(prev => !prev);
    console.log("Add Client clicked : "+ showModal);
  };

  const handleAddClient = (client) => {
    console.log("New client:", client);
    // later: API call + update state
  };

  const hasClients = SampleSet.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className={SampleSet.length <= 0 ? "invisible" : ""}>
          <h1 className="text-2xl font-semibold text-gray-800">
            Select Client
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Choose a client to continue
          </p>
        </div>

        {/* Add Client (when clients exist) */}
        {hasClients && (
          <button
            onClick={handleModel}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
            text-white font-medium shadow-sm hover:shadow-md transition"
            style={{ backgroundColor: "#7367f0" }}
          >
            <Plus size={16} />
            Add Client
          </button>
        )}
      </div>

      {/* No Clients State */}
      {!hasClients ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <p className="text-gray-500 mb-6">
            No clients found. Start by adding your first client.
          </p>

          <button
            onClick={handleModel}
            className="flex items-center gap-2 px-6 py-3 rounded-xl
            text-white font-medium shadow-md hover:shadow-lg transition"
            style={{ backgroundColor: "#7367f0" }}
          >
            <Plus size={18} />
            Add Client
          </button>
        </div>
      ) : (
        /* Client Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {SampleSet.map((name) => (
            <button
              key={name}
              onClick={() => handleSelectClient(name)}
              className="flex flex-col items-center gap-3 bg-white rounded-xl p-5
              border border-gray-200
              hover:border-[#7367f0]
              hover:shadow-md
              transition-all
              focus:outline-none
              focus:ring-1
              focus:ring-[#7367f0]/40"
            >
              <Avatar name={name} size={48} />
              <span className="text-sm font-medium text-gray-700">
                {name}
              </span>
            </button>
          ))}
        </div>
      )}
      {
        showModal && <AddClient open={showModal} onClose={() => setShowModal(false)} onSubmit={handleAddClient} />
      }
    </div>
  );
}
