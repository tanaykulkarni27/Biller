import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import aaxios from "@/hooks/aaxios";
import Loader from "../components/Loader";
import AuthLegalFooter from "../components/AuthLegalFooter";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const nav = useNavigate();
  
  useEffect(() => {
    if(!token){
        nav("/forgot-password");
    }
  },[token]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setIsLoading(true);

      await aaxios.post("/user/update-password",
        { newPassword:password },
        {
            headers: {
            Authorization: `${token}`,
            },
        });
      setIsLoading(false);
      nav("/"); // back to login
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || "Reset failed");
      console.log(err.response?.data?.message || "Reset failed");
      console.log(err || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 sm:p-8">

        <h1 className="text-xl sm:text-2xl font-semibold text-center mb-6">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
                focus:outline-none focus:border-[#7367f0] focus:ring-1 focus:ring-[#7367f0]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
                focus:outline-none focus:border-[#7367f0] focus:ring-1 focus:ring-[#7367f0]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-medium
              hover:opacity-90 transition"
          >
            Reset Password
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        <AuthLegalFooter />
      </div>

      {isLoading && <Loader />}
    </div>
  );
}

export default ResetPassword;
