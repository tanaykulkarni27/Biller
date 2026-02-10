import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import aaxios from "@/hooks/aaxios";
import Loader from "../components/Loader";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const nav = useNavigate();

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link");
        return;
      }

      try {
        await aaxios.get(`/user/verify-email?token=${token}`);

        setStatus("success");
        setMessage("Email verified successfully! Redirecting to login…");

        // redirect after short delay
        setTimeout(() => {
          nav("/", { replace: true });
        }, 2000);

      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "Verification failed or link expired"
        );
      }
    };

    verifyEmail();
  }, [token, nav]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">

        {status === "loading" && (
          <>
            <Loader />
            <p className="mt-4 text-gray-600">Verifying your email…</p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-xl font-semibold text-green-600">
              Verification Successful 🎉
            </h1>
            <p className="mt-4 text-gray-600">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-xl font-semibold text-red-500">
              Verification Failed
            </h1>
            <p className="mt-4 text-gray-600">{message}</p>

            <button
              onClick={() => nav("/")}
              className="mt-6 bg-primary text-white px-6 py-2 rounded-lg"
            >
              Go to Login
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default VerifyEmail;