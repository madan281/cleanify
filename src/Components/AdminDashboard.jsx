import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const workers = [
  { name: "Alice", email: "alice@cleanify.com" },
  { name: "Bob", email: "bob@cleanify.com" },
  { name: "Charlie", email: "charlie@cleanify.com" },
];

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("All");
  const [expandedRow, setExpandedRow] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  const filteredBookings =
    filter === "All"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  const indexOfLast = currentPage * bookingsPerPage;
  const indexOfFirst = indexOfLast - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    const fetchBookings = async () => {
      const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setBookings(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchBookings();
  }, []);

  const updateBooking = async (id, field, value) => {
    const bookingRef = doc(db, "bookings", id);
    await updateDoc(bookingRef, { [field]: value });
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  };

  const handleExport = () => {
    const csv = Papa.unparse(bookings);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "bookings.csv");
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} p-6`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">📋 Admin Dashboard</h2>
        <div className="space-x-4">
          <select
            className="p-2 border rounded"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-3 py-2 rounded"
          >
            📥 Export CSV
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-600 text-white px-3 py-2 rounded"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-blue-100">
            <th className="border p-2">User</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Worker</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentBookings.map((booking, i) => (
            <>
              <tr key={booking.id} className="hover:bg-blue-50 text-center">
                <td className="border p-2">{booking.user}</td>
                <td className="border p-2">{booking.date}</td>
                <td className="border p-2">
                  <select
                    className="border p-1"
                    value={booking.status}
                    onChange={(e) =>
                      updateBooking(booking.id, "status", e.target.value)
                    }
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </td>
                <td className="border p-2">
                  <select
                    className="border p-1"
                    value={booking.assignedWorker || ""}
                    onChange={(e) =>
                      updateBooking(booking.id, "assignedWorker", e.target.value)
                    }
                  >
                    <option value="">Assign</option>
                    {workers.map((w) => (
                      <option key={w.name} value={w.name}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border p-2">
                  <button
                    onClick={() =>
                      setExpandedRow((prev) => (prev === i ? null : i))
                    }
                    className="text-blue-600 underline"
                  >
                    {expandedRow === i ? "Hide" : "Details"}
                  </button>
                </td>
              </tr>
              {expandedRow === i && (
                <tr className={`${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                  <td colSpan="5" className="p-4 text-left">
                    <strong>Address:</strong> {booking.address} <br />
                    <strong>Instructions:</strong>{" "}
                    {booking.instructions || "N/A"} <br />
                    <strong>Worker Email:</strong>{" "}
                    {
                      workers.find(
                        (w) => w.name === booking.assignedWorker
                      )?.email
                    }
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-4">
        {Array.from({
          length: Math.ceil(filteredBookings.length / bookingsPerPage),
        }).map((_, index) => (
          <button
            key={index}
            className={`px-3 py-1 border rounded ${
              currentPage === index + 1 ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
