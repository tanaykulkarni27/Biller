import { Link } from "react-router-dom";

export default function AuthLegalFooter() {
  return (
    <div className="mt-6 border-t border-gray-200 pt-4 text-center">
      <p className="text-xs leading-6 text-gray-500">
        By continuing, you agree to our{" "}
        <Link
          to="/privacy-policy"
          className="font-medium text-primary transition hover:underline"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
