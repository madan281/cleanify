import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import UserLogin from "./Components/UserLogin";
import Signup from "./Components/Signup";
import AdminLogin from "./Components/AdminLogin";
import UserDashboard from "./Components/UserDashboard";
import AdminDashboard from "./Components/AdminDashboard";
import BookingForm from "./Components/BookingForm";
import PrivateRoute from "./Components/PrivateRoute";
import AdminRoute from "./Components/AdminRoute";
import WorkerDashboard from "./Components/WorkerDashboard";
import WorkerSignup from "./Components/WorkerSignup";
import WorkerRoute from "./Components/WorkerRoute";
import Navbar from "./Components/Navbar";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
function App() {
   const [user] = useAuthState(auth);
  return (
    <Router>
       <div className="App">
        <Navbar /> 
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/book" element={<BookingForm />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/worker-signup" element={<WorkerSignup />} />
        {/* Protected routes */}
        <Route
    path="/dashboard"
    element={
      <PrivateRoute>
        <UserDashboard />
      </PrivateRoute>
    }
  />
  
  <Route
    path="/admin-dashboard"
    element={
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    }
  />

  <Route
    path="/book"
    element={
      <PrivateRoute>
        <BookingForm />
      </PrivateRoute>
    }
  />
  <Route
  path="/worker-dashboard"
  element={
    <PrivateRoute>
      <WorkerDashboard />
    </PrivateRoute>
  }
/>
<Route
  path="/worker-dashboard"
  element={
    <WorkerRoute>
      <WorkerDashboard />
    </WorkerRoute>
  }
/>
      </Routes>
      </div>
    </Router>
  );
}

export default App;

