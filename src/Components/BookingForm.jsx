import { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function BookingForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(auth.currentUser?.email || "");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("Basic Cleaning");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [instructions, setInstructions] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !address || !date) {
      alert("❌ Please fill in all required fields.");
      return;
    }

    try {
      await addDoc(collection(db, "bookings"), {
        name,
        email,
        phone,
        service,
        address,
        date,
        instructions,
        createdAt: serverTimestamp(),
        status: "Pending",
      });

      alert("✅ Booking request submitted!");
      setName("");
      setPhone("");
      setService("Basic Cleaning");
      setAddress("");
      setDate("");
      setInstructions("");
    } catch (error) {
      alert("Error saving booking: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">🧹 Book a Cleaning</h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-4 p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full mb-4 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full mb-4 p-2 border rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <select
          className="w-full mb-4 p-2 border rounded"
          value={service}
          onChange={(e) => setService(e.target.value)}
        >
          <option>Basic Cleaning</option>
          <option>Deep Cleaning</option>
          <option>Move-In/Move-Out</option>
        </select>

        <input
          type="text"
          placeholder="Address"
          className="w-full mb-4 p-2 border rounded"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <input
          type="date"
          className="w-full mb-4 p-2 border rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <textarea
          placeholder="Special Instructions (optional)"
          className="w-full mb-4 p-2 border rounded"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        ></textarea>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Booking
        </button>
      </form>
    </div>
  );
}
