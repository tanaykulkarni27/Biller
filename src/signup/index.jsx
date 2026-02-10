import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import aaxios from '@/hooks/aaxios'
import Loader from '../components/Loader'


export default function Signup() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [reqError, setReqError] = useState('');
  const nav = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log({ email, password })
     try {
      setIsLoading(true);
    const response = await aaxios.post("/register", {
      name,
      email,
      password,
      address
    });
    alert('Verification email sent. Please check your gmail.');  
    nav('/login');
    setIsLoading(false);
  } catch (error) {
    setIsLoading(false);
    console.log(error);
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
          Create Account
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
                focus:outline-none 
                focus:border-[#7367f0] 
                focus:ring-1
                focus:ring-[#7367f0]"
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Address
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="city,state,country"
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
            Sign Up
          </button>
        </form>
        <p className="text-red-500 text-sm mt-6 text-center">{reqError}</p>
        {/* Footer */}
        <p className="text-sm text-gray-500 text-center mt-6">
          Already have an account?{' '}
          <Link to="/login">
            <span className="text-primary font-medium cursor-pointer">
              Login
            </span>
          </Link>
        </p>
      </div>


      {isLoading && (<Loader />)}
    </div>
  
  )
}