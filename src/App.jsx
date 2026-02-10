import './App.css'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from './login/page'
import Clients from './clients/page'
// Single Client Handling 
import DashboardLayout from './dashboard/layout'
import Billing from './dashboard/Billing'
import AddBill from './dashboard/AddBill'
import Myacc from './dashboard/myacc'
import ViewBill from './ViewBill/page'
import ForgotPassword from './forgotpassword/Email'
import ResetPassword from './forgotpassword/resetpassword'

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

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
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
         <Route element={<ProtectedRoute />}>
          <Route path="/clients" element={<Clients />} />
          <Route path="/dashboard/:client_name" element={<DashboardLayout />} >
            <Route index element={<Navigate to="billing" replace />} />
            <Route path="billing" element={<Billing />} />
            <Route path="addBill" element={<AddBill />} />
            <Route path="myacc" element={<Myacc />} />
            <Route path="bill" element={<ViewBill />} />
          </Route>
        
        </Route>
      
        {/* <Route path="*" element={<NotFound />} /> */}

      </Routes>
    </BrowserRouter>
  )
}

export default App;
