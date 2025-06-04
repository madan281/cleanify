import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

const adminEmail = "admin@cleanify.com";

export default function AdminRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>Loading...</div>;
  if (!user || user.email !== adminEmail) return <Navigate to="/admin-login" />;

  return children;
}
