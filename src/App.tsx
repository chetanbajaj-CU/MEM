import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Fitness } from "./pages/Fitness";
import { Nutrition } from "./pages/Nutrition";
import { HealthTools } from "./pages/HealthTools";
import { Programs } from "./pages/Programs";
import { GymSchedule } from "./pages/GymSchedule";
import { MedicalNutrition } from "./pages/MedicalNutrition";
import { ProgramExecution } from "./pages/ProgramExecution";
import { MentalGame } from "./pages/MentalGame";
import { Aarogya } from "./pages/Aarogya";
import { Profile } from "./pages/Profile";
import { AdminMessages } from "./pages/AdminMessages";
import { Login } from "./pages/Login";
import { useAuth } from "./context/AuthContext";
import { useDailyReminder } from "./hooks/useDailyReminder";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  useDailyReminder();
  
  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin"></div></div>;
  }
  
  if (!user) {
    return <Login />;
  }
  
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin"></div></div>;
  }
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthGate>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="fitness" element={<Fitness />} />
            <Route path="nutrition" element={<Nutrition />} />
            <Route path="programs" element={<Programs />} />
            <Route path="programs/:programId" element={<ProgramExecution />} />
            <Route path="gym-schedule" element={<GymSchedule />} />
            <Route path="medical-nutrition" element={<MedicalNutrition />} />
            <Route path="aarogya" element={<Aarogya />} />
            <Route path="mental-game" element={<MentalGame />} />
            <Route path="profile" element={<Profile />} />
            <Route path="health-tools" element={<HealthTools />} />
            <Route path="admin" element={<AdminRoute><AdminMessages /></AdminRoute>} />
            <Route path="admin-messages" element={<AdminRoute><AdminMessages /></AdminRoute>} />
            <Route path="community" element={<div className="p-8 text-center"><h1 className="text-4xl font-black uppercase text-white">Community Coming Soon</h1></div>} />
          </Route>
        </Routes>
      </AuthGate>
    </BrowserRouter>
  );
}
