import React, { useState,useEffect } from "react";
import { Trash2, Plus, Type, Hash, Layout, Save, X, Pen } from "lucide-react";
import {storage} from "../hooks/storage";
import aaxios from "../hooks/aaxios";
export default function AddBill() {
  const [allowEditColumns, setAllowEditColumns] = useState(false);
  const [columns, setColumns] = useState([
  { id: 1, name: "Date", isNumeric: false },
  { id: 2, name: "Work", isNumeric: false },
  { id: 3, name: "Hours Spend", isNumeric: true },
  { id: 4, name: "Fees", isNumeric: true },
]);
  const [newColName, setNewColName] = useState("");
  const [isNumeric, setIsNumeric] = useState(false);
  const [editingId, setEditingId] = useState(null); // Track edit state

  const themeColor = "#7367f0";
  const [rows, setRows] = useState(() => {
  const defaultRow = {};
  [
    { name: "Date" },
    { name: "Task" },
    { name: "Hours Spend" },
    { name: "Fees" },
  ].forEach((col) => {
    defaultRow[col.name] = col.name === "Date"
      ? new Date().toISOString().split("T")[0]
      : "";
  });
  return [defaultRow];
});

  const [invoiceNo, setInvoiceNo] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [total_amount, setTotalAmount] = useState(0);
  // Add empty row
  const addRow = () => {
    const emptyRow = {};
    columns.forEach((col) => {
      emptyRow[col.name] = "";
    });
    setRows([...rows, emptyRow]);
  };

useEffect(() => {
  if (rows.length === 0 && columns.length > 0) {
    const defaultRow = {};
    columns.forEach((col) => {
      defaultRow[col.name] =
        col.name === "Date"
          ? new Date().toISOString().split("T")[0]
          : "";
    });
    setRows([defaultRow]);
  }
}, [columns]);


  // Update cell
  const updateCell = (rowIndex, colName, value) => {
    const updated = [...rows];
    updated[rowIndex][colName] = value;
    setRows(updated);
  };

  // Delete row
  const deleteRow = (rowIndex) => {
    setRows(rows.filter((_, i) => i !== rowIndex));
  };
  // Unified handler for Add and Update
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newColName.trim()) return;

    if (editingId) {
      // Update Logic
      setColumns(
        columns.map((col) =>
          col.id === editingId ? { ...col, name: newColName, isNumeric } : col,
        ),
      );
      setEditingId(null);
    } else {
      // Add Logic
      const newColumn = {
        id: Date.now(),
        name: newColName,
        isNumeric: isNumeric,
      };
      setColumns([...columns, newColumn]);
    }

    // Reset Form
    setNewColName("");
    setIsNumeric(false);
  };

  // Populate form with column data
  const startEdit = (col) => {
    setNewColName(col.name);
    setIsNumeric(col.isNumeric);
    setEditingId(col.id);
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setNewColName("");
    setIsNumeric(false);
    setEditingId(null);
  };

  const removeColumn = (e, id) => {
    e.stopPropagation(); // Prevent triggering edit when clicking delete
    setColumns(columns.filter((col) => col.id !== id));
    if (editingId === id) cancelEdit();
  };

  const submitInvoice = () => {
    const InvoiceData = {
                          vendorId:storage.get('client')?storage.get('client').vendorId:null,
                          invoice_no : invoiceNo,
                          date : invoiceDate,
                          status,
                          items : rows,
                          total_amount
                        };
    if(!invoiceNo || !invoiceDate || !status || rows.length <= 0 || !InvoiceData.vendorId || !total_amount){
      alert("Please fill all required fields");
      return;
    }
    aaxios.post('/invoice/add', InvoiceData).then(res=>{
      alert("Invoice created successfully");
      window.history.back();
    }).catch(err=>{
      alert("Error creating invoice");
      console.log(err.response?.data?.message  || "Error creating invoice");
    });
  };

  return (
    <>
      <div className="md:hidden min-h-screen bg-white px-6 py-12 flex items-center justify-center">
        <p className="text-center text-gray-700 text-base font-medium">
          Page can&apos;t be opened on small device.
        </p>
      </div>

      <div className="hidden md:block bg-white min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={` ${allowEditColumns?'border-b pb-6 mb-8':'m-0 p-0'}  border-gray-200 `}>
          <h2 className="text-2xl font-bold text-gray-800">
            Configure Invoice
          </h2>
          <p className={`text-gray-500 ${!allowEditColumns?'hidden':'block'}`}>
            Define the structure of your invoice table.
          </p>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 ${allowEditColumns?'' : 'hidden'}`}>
          {/* LEFT: Form Section (Merged into white bg) */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                {editingId ? (
                  <Save size={18} color={themeColor} />
                ) : (
                  <Plus size={18} color={themeColor} />
                )}
                {editingId ? "Edit Column" : "Add New Column"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Input Field */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Column Name
                  </label>
                  <input
                    type="text"
                    value={newColName}
                    onChange={(e) => setNewColName(e.target.value)}
                    placeholder="e.g. Particulars, Legal Service"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all"
                    style={{
                      "--tw-ring-color": themeColor,
                      borderColor: editingId
                        ? themeColor
                        : newColName
                          ? themeColor
                          : "",
                    }}
                  />
                </div>

                {/* Custom Toggle Switch */}
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">
                      Numerical?
                    </span>
                    <span className="text-xs text-gray-500">
                      Is this a number field?
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsNumeric(!isNumeric)}
                    className="relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none"
                    style={{
                      backgroundColor: isNumeric ? themeColor : "#cbd5e1",
                    }}
                  >
                    <span
                      className={`
                        block w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out mt-0.5 ml-0.5
                        ${isNumeric ? "translate-x-6" : "translate-x-0"}
                      `}
                    />
                  </button>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={!newColName}
                    className="flex-1 py-2.5 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ backgroundColor: themeColor }}
                  >
                    {editingId ? "Update Column" : "Add Column"}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-3 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                      title="Cancel Editing"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT: List Section (Greyish Borders) */}
          <div className="lg:col-span-8">
            <div className="h-full flex flex-col">
              <div className="flex items-center gap-2 text-gray-500 mb-4 border-b border-gray-200 pb-2">
                <Layout size={16} />
                <span className="text-sm font-medium uppercase tracking-wide">
                  Table Structure Preview
                </span>
              </div>

              {columns.length === 0 ? (
                <div className="flex-1 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center p-10 text-gray-400 bg-gray-50/50">
                  <Layout size={40} className="mb-3 opacity-40" />
                  <p className="font-medium text-gray-600">
                    No columns added yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {columns.map((col) => (
                    <div
                      key={col.id}
                      onClick={() => startEdit(col)}
                      className={`
                        group flex items-center justify-between p-4 rounded-lg 
                        border-2 cursor-pointer transition-all duration-200
                        ${
                          editingId === col.id
                            ? "bg-[#7367f0]/5 border-[#7367f0]"
                            : "bg-white border-gray-300 hover:border-gray-400 hover:shadow-sm"
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                          style={{
                            backgroundColor:
                              editingId === col.id ? themeColor : "#f1f5f9",
                            color: editingId === col.id ? "#fff" : "#64748b",
                          }}
                        >
                          {col.isNumeric ? (
                            <Hash size={18} />
                          ) : (
                            <Type size={18} />
                          )}
                        </div>

                        <div className="flex flex-col">
                          <span
                            className={`font-semibold ${editingId === col.id ? "text-[#7367f0]" : "text-gray-700"}`}
                          >
                            {col.name}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            {col.isNumeric ? "Number Field" : "Text Field"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {editingId === col.id && (
                          <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-white text-[#7367f0]">
                            Editing
                          </span>
                        )}
                        <button
                          onClick={(e) => removeColumn(e, col.id)}
                          className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"
                          title="Remove column"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* ROWS SECTION */}
        {columns.length > 0 && (
          <div className={`${allowEditColumns?'mt-10' : 'mt-5'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Layout size={18} color={themeColor} />
                Invoice Data
              </h3>
              <div className="flex justify-end items-center space-x-2"> 
                <button
                  onClick={()=> setAllowEditColumns(!allowEditColumns)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition"
                  style={{ backgroundColor: themeColor }}
                >
                  {!allowEditColumns ? <Pen size={16} /> : <Save size={16} />}
                  {allowEditColumns ? "Save Columns" : "Edit Columns"}
                </button>
                <button
                  onClick={addRow}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition"
                  style={{ backgroundColor: themeColor }}
                >
                  <Plus size={16} />
                  Add Row
                </button>
              </div>
            </div>

            {rows.length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 bg-gray-50">
                No rows added yet
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto no-scrollbar">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {columns.map((col) => (
                        <th key={col.id} className="px-4 py-3 text-left">
                          {col.name}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-t">
                        {columns.map((col) => (
                          <td key={col.id} className="px-4 py-2">
                            <input
                              type={col.isNumeric ? "number" : "text"}
                              placeholder={col.name}
                              value={row[col.id]}
                              onChange={(e) =>
                                updateCell(rowIndex, col.name, e.target.value)
                              }
                              className={`w-full px-2 py-1.5 rounded-md 
                                bg-gray-100
                                focus:outline-none 
                                focus:ring-1
                                focus:ring-[${themeColor}]`}
                            />
                          </td>
                        ))}

                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() => deleteRow(rowIndex)}
                            className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Invoice Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Number
            </label>
            <input
              type="text"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              placeholder="INV-001"
              className={`w-full px-4 py-2 rounded-lg border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-[${themeColor}]`}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300
              focus:outline-none focus:ring-2 bg-white"
              style={{ "--tw-ring-color": themeColor }}
            >
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Date
            </label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300
              focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': themeColor }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Amount
            </label>
            <input
              type="number"
              value={total_amount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300
              focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': themeColor }}
            />
          </div>
        </div>
        <div className="mt-12 flex justify-end gap-3">
        <button
          className="px-6 py-2.5 rounded-lg border border-gray-300
          text-gray-700 font-medium hover:bg-gray-50 transition"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>

        <button
          onClick={submitInvoice}
          className="flex items-center gap-2 px-6 py-2.5
          rounded-lg text-white font-semibold shadow-md
          hover:shadow-lg transition active:scale-95"
          style={{ backgroundColor: themeColor }}
        >
          <Save size={18} />
          Save Invoice
        </button>
      </div>
        </div>
      </div>
    </>
  );
}
