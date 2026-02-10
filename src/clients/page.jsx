import React, { useEffect } from "react";
import Avatar from "@/components/Avatar";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import AddClient from "@/addClient/page";
import aaxios from "@/hooks/aaxios"
import {storage} from "@/hooks/storage"

export default function Clients() {
  const navigate = useNavigate();

  const [showModal, setShowModal] = React.useState(false);
  const [error,setError] = React.useState("");
  const [clients, setClients] = React.useState([]);

  useEffect(() => { 
        aaxios.get('/client').then(res => {
            setClients(res.data);
        }).catch(err => {
            console.error("Error fetching clients:", err);
        });
  }, []);

  const handleSelectClient = (client) => {
    storage.set("client", client);
    navigate(`/dashboard/${encodeURIComponent(client.name)}`);
  };

  const handleModel = () => {
    // later: open modal or navigate to add-client page
    setShowModal(prev => !prev);
    console.log("Add Client clicked : "+ showModal);
  };

  const handleAddClient = (client) => {
    // alert("Client added: " + JSON.stringify(client));
    // console.log("New client:", client);
    // return;
    // later: API call + update state
    aaxios.post('/client', client).then(res => {
        handleModel();
        setClients(prev=>[...prev,client])
    }).catch(err => {
        console.error("Error adding client:", err);
        setError(err.response?.data?.message || "Failed to add client");  
    });
  };

  // const hasClients = clients.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className={clients.length <= 0 ? "invisible" : ""}>
          <h1 className="text-2xl font-semibold text-gray-800">
            Select Client
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Choose a client to continue
          </p>
        </div>

        {/* Add Client (when clients exist) */}
        {clients.length > 0 && (
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
      {clients.length <= 0 ? (
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
          {clients.map((client) => (
            <button
              key={name}
              onClick={() => handleSelectClient(client)}
              className="flex flex-col items-center gap-3 bg-white rounded-xl p-5
              border border-gray-200
              hover:border-[#7367f0]
              hover:shadow-md
              transition-all
              focus:outline-none
              focus:ring-1
              focus:ring-[#7367f0]/40"
            >
              <Avatar name={client.name} size={48} />
              <span className="text-sm font-medium text-gray-700">
                {client.name}
              </span>
            </button>
          ))}
          
        </div>
      )}
      {
        showModal && <AddClient open={showModal} onClose={() => setShowModal(false)} onSubmit={handleAddClient} error={error}/>
      }
    </div>
  );
}
