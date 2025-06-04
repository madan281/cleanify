import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function WorkerRoute({ children }) {
  const [user, loading] = useAuthState(auth);
  const [isWorker, setIsWorker] = useState(null);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(docRef);
      const role = userDoc.data()?.role;
      setIsWorker(role === "worker");
    };

    if (user) checkRole();
  }, [user]);

  if (loading || isWorker === null) return <div>Loading...</div>;

  if (!user || !isWorker) return <Navigate to="/login" />;

  return children;
}
