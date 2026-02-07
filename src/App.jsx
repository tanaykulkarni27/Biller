import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './login/page'
import Dashboard from './dashboard/page'
function App() {

  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      
        {/* <Route path="*" element={<NotFound />} /> */}

      </Routes>
    </BrowserRouter>
  )
}

export default App;
