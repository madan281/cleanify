import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { signOut } from "firebase/auth";

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const userEmail = auth.currentUser?.email;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userEmail) return;

    const q = query(collection(db, "bookings"), where("email", "==", userEmail));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [userEmail]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div>
      {/* NavBar */}
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex gap-4">
          <Link to="/" className="hover:underline">🏠 Home</Link>
          <Link to="/book" className="hover:underline">🧼 Book a Cleaning</Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-semibold hidden sm:inline">👋 {userEmail}</span>
          <button onClick={handleLogout} className="bg-white text-blue-700 px-4 py-1 rounded hover:bg-gray-100">
            🚪 Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">📋 My Bookings</h2>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-500">You have no bookings yet.</p>
        ) : (
          <div className="overflow-x-auto shadow rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-100 text-gray-700 uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Service</th>
                  <th className="px-4 py-3 text-left">Address</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Worker</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{b.name}</td>
                    <td className="px-4 py-2">{b.email}</td>
                    <td className="px-4 py-2">{b.service}</td>
                    <td className="px-4 py-2">{b.address}</td>
                    <td className="px-4 py-2">{b.date}</td>
                    <td className="px-4 py-2">{b.status}</td>
                    <td className="px-4 py-2">{b.assignedWorker || "Not Assigned"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
