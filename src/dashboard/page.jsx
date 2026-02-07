import React from "react";
import Avatar from "@/components/Avatar";

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
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Select Client
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Choose a client to continue
        </p>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {SampleSet.map((name) => (
          <button
            key={name}
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
    </div>
  );
}
