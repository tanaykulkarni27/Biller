import { useState } from "react";
import aaxios from "@/hooks/aaxios";
import Loader from "../components/Loader";
import AuthLegalFooter from "../components/AuthLegalFooter";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setIsLoading(true);

      await aaxios.post("/user/forgot-password", { email });

      setMessage("Password reset link sent to your email");
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        
        <h1 className="text-xl sm:text-2xl font-semibold text-center mb-6">
          Forgot Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                focus:outline-none focus:border-[#7367f0] focus:ring-1 focus:ring-[#7367f0]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-medium
              hover:opacity-90 transition"
          >
            Send Reset Link
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        {message && <p className="text-green-600 text-sm mt-4 text-center">{message}</p>}
        <AuthLegalFooter />
      </div>

      {isLoading && <Loader />}
    </div>
  );
}

export default ForgotPassword;
