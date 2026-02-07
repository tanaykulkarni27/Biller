import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './login/page'
import Clients from './clients/page'
// Single Client Handling 
import DashboardLayout from './dashboard/layout'
import Billing from './dashboard/Billing'
import AddBill from './dashboard/AddBill'
import Myacc from './dashboard/myacc'
function App() {

  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/dashboard/:client_name" element={<DashboardLayout />} >
          <Route index element={<Navigate to="billing" replace />} />
          <Route path="billing" element={<Billing />} />
          <Route path="addBill" element={<AddBill />} />
          <Route path="myacc" element={<Myacc />} />
        </Route>
      
        {/* <Route path="*" element={<NotFound />} /> */}

      </Routes>
    </BrowserRouter>
  )
}

export default App;
