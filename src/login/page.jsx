import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import aaxios from '@/hooks/aaxios'
import Loader from '../components/Loader'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [reqError, setReqError] = useState('');
  const nav = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log({ email, password })
     try {
      setIsLoading(true);
    const response = await aaxios.post("/login", {
      email,
      password,
    });
      
    localStorage.setItem("token", response.data.token);
    console.log(localStorage.getItem("token"));
    nav('/clients');  
    setIsLoading(false);
  } catch (error) {
    setIsLoading(false);
    if (error.response) {
      setReqError(error.response.data.message || "Login failed");
      // server responded with error status
      throw new Error(error.response.data.message || "Login failed");
    } else if (error.request) {
      setReqError("No response from server");
      throw new Error("No response from server");
    } else {
      // something else
      throw new Error(error.message);
    }
  }
    
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        
        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-semibold text-center mb-6">
          Login
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
                focus:outline-none 
                focus:border-[#7367f0] 
                focus:ring-1
                focus:ring-[#7367f0]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
                focus:outline-none 
                focus:border-[#7367f0] 
                focus:ring-1
                focus:ring-[#7367f0]"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-medium
              hover:opacity-90 transition active:scale-[0.99]"
          >
            Login
          </button>
        </form>
        <p className="text-red-500 text-sm mt-6 text-center">{reqError}</p>
        <p className="text-sm text-center mt-4">
          <span
            onClick={() => nav("/forgot-password")}
            className="text-primary font-medium cursor-pointer hover:underline"
          >
            Forgot password?
          </span>
        </p>
        {/* Footer */}
        <p className="text-sm text-gray-500 text-center mt-6">
          Don’t have an account?{' '}
          <span className="text-primary font-medium cursor-pointer">
            Sign up
          </span>
        </p>
      </div>


      {isLoading && (<Loader />)}
    </div>
  )
}

export default Login
