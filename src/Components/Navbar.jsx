import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user] = useAuthState(auth);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        const token = await user.getIdTokenResult();
        setRole(token.claims.role || "user");
      }
    };
    fetchRole();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const navLinkStyle = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-500";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 px-6 py-3 flex justify-between items-center">
      <NavLink to="/" className="text-xl font-bold text-blue-700">Cleanify</NavLink>
      <div className="flex gap-4">
        {user && (
          <>
            {role === "user" && (
              <>
                <NavLink to="/dashboard" className={navLinkStyle}>Dashboard</NavLink>
                <NavLink to="/book" className={navLinkStyle}>Book Cleaning</NavLink>
              </>
            )}
            {role === "admin" && (
              <>
                <NavLink to="/admin-dashboard" className={navLinkStyle}>Admin Dashboard</NavLink>
                <NavLink to="/admin-profile" className={navLinkStyle}>Profile</NavLink>
              </>
            )}
            {role === "worker" && (
              <NavLink to="/worker-dashboard" className={navLinkStyle}>Worker Tasks</NavLink>
            )}
            <button onClick={handleLogout} className="text-red-500 font-medium ml-4">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
