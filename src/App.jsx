import './App.css'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from './login/page'
import VerifyEmail from './login/verifyEmail'
import Clients from './clients/page'
// Single Client Handling 
import DashboardLayout from './dashboard/layout'
import Billing from './dashboard/Billing'
import AddBill from './dashboard/AddBill'
import Myacc from './dashboard/myacc'
import ViewClient from './dashboard/view-client'
import Calender from './dashboard/calender/page'
import MattersPage from './dashboard/matters/page'
import AddMatterPage from './dashboard/matters/add/page'
import TasksPage from './dashboard/tasks/page'
import AddTaskPage from './dashboard/tasks/add/page'
import ViewBill from './ViewBill/page'
import ForgotPassword from './forgotpassword/Email'
import ResetPassword from './forgotpassword/resetpassword'
import Signup from './signup'
import PrivacyPolicy from './legal/privacy-policy'
import {storage} from '@/hooks/storage';

const ProtectedRoute = () => {
  const token = storage.get("token");
  // console.log("Checking token in ProtectedRoute:", token); // Debug log
  // if not logged in, redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // if logged in, render child routes
  return <Outlet />;
};



function App() {

  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/signup" element={<Signup />} />
         <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />} >
            <Route path="myacc" element={<Myacc />} />
            <Route index element={<Navigate to="myacc" replace />} />
            <Route path="clients" element={<Clients />} />
            <Route path="billing" element={<Billing />} />
            <Route path="clients/view-client" element={<ViewClient />} />
            <Route path="calendar" element={<Calender />} />
            <Route path="matters" element={<MattersPage />} />
            <Route path="matters/add" element={<AddMatterPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="tasks/add" element={<AddTaskPage />} />
            <Route path="addBill" element={<AddBill />} />
            <Route path="bill" element={<ViewBill />} />
          </Route>
        
        </Route>
      
        <Route path="*" element={<Navigate to="/login" replace/>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App;
