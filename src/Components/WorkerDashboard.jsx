import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

export default function WorkerDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, "bookings"),
        where("assignedWorker", "==", auth.currentUser.email)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(data);
    };

    fetchBookings();
  }, []);

  // ✅ Handle status updates
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "bookings", id), {
        status: newStatus,
      });
      alert("✅ Status updated!");

      // Optional: Update UI immediately
      setBookings(prev =>
        prev.map(b => (b.id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      alert("❌ Failed to update status: " + err.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Worker Dashboard</h2>
      {bookings.length === 0 ? (
        <p>No assigned bookings.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking.id} className="border p-4 mb-4 rounded shadow">
            <p><strong>Address:</strong> {booking.address}</p>
            <p><strong>Date:</strong> {booking.date}</p>
            <p><strong>Instructions:</strong> {booking.instructions}</p>
            <p><strong>Status:</strong></p>

            {/* ✅ Status Dropdown */}
            <select
              className="mt-2 p-2 border rounded"
              value={booking.status}
              onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        ))
      )}
    </div>
  );
}
