import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import aaxios from "@/hooks/aaxios";
import Loader from "../components/Loader";
import {storage} from '@/hooks/storage';
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reqError, setReqError] = useState("");

  const [showResendPopup, setShowResendPopup] = useState(false);
  const [resendStatus, setResendStatus] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log({ email, password })
    try {
      setIsLoading(true);
      const response = await aaxios.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      storage.set("user", response.data.user);
      storage.set("stats", response.data.stats);
      // console.log(localStorage.getItem("token"));
      nav("/dashboard");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        const message = error.response.data.message || "Login failed";
        setReqError(message);
        if (message.toLowerCase().includes("not verified")) {
          setShowResendPopup(true);
          setResendStatus("");
        }
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
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendStatus("");
    try {
      setResendLoading(true);
      setResendStatus("");

      await aaxios.post("/user/resend-verification", { email });

      setResendStatus("Verification email sent successfully!");
      setResendLoading(false);
      
    } catch (err) {
      setResendLoading(false);
      setResendStatus(
        err.response?.data?.message || "Failed to resend verification email",
      );
    }
  };

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
          Don’t have an account?{" "}
          <Link to="/signup">
            <span className="text-primary font-medium cursor-pointer">
              Sign up
            </span>
          </Link>
        </p>
      </div>
      {isLoading && <Loader />}

      {showResendPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Email not verified
            </h2>

            <p className="text-sm text-gray-600 mt-3">
              Your account is not verified. Please check your email for the
              verification link.
            </p>
            {/* Added Spam Note */}
            <p className="text-xs text-gray-500 mt-2">
              If you don’t see the email, please check your spam or junk folder.
            </p>
            {resendStatus && (
              <p className="text-sm mt-3 text-green-600">{resendStatus}</p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowResendPopup(false)}
                className="flex-1 border rounded-lg py-2 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleResendVerification}
                disabled={resendLoading}
                className="flex-1 bg-primary text-white rounded-lg py-2 text-sm
            hover:opacity-90 disabled:opacity-50"
              >
                {resendLoading ? "Sending..." : "Resend Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
