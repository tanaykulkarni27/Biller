import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ email, password })
  }

  const handleLogin = () => {
    nav('/clients')
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
            onClick={handleLogin}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium
              hover:opacity-90 transition active:scale-[0.99]"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-500 text-center mt-6">
          Don’t have an account?{' '}
          <span className="text-primary font-medium cursor-pointer">
            Sign up
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login
