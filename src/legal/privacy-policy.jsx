import { Link } from "react-router-dom";
import { Lock, KeyRound, ShieldCheck, FileText } from "lucide-react";

const securityCards = [
  {
    title: "Encrypted Storage",
    description:
      "Sensitive values are encrypted before they are saved, so they are not stored as normal readable text.",
    icon: Lock,
  },
  {
    title: "JWT Access Control",
    description:
      "Protected API routes check a signed authentication token before any private data is returned.",
    icon: KeyRound,
  },
  {
    title: "Per-User Access",
    description:
      "After token verification, requests are tied to the logged-in user's email so users only access their own records.",
    icon: ShieldCheck,
  },
];

const sections = [
  {
    title: "What We Collect",
    body:
      "We collect the information you enter into this software, such as your account details, client records, matters, tasks, invoice details, and contact information needed to run the service.",
  },
  {
    title: "How Data Is Saved",
    body:
      "Before sensitive text-based fields are stored, our backend encrypts them using the Node.js crypto library with AES-256-CBC. A secret key is derived from a protected environment variable, and a fresh initialization vector is created for each encryption operation.",
  },
  {
    title: "Plain Text To Encrypted Text Example",
    body:
      "For example, a normal value like 'John Doe, 21 Lake Road, Mumbai' is first readable to the application when you submit it. Before it is saved, it is transformed into an encrypted value in a format similar to 'enc:8f4a...:3cd9...'. That stored value is intentionally unreadable as plain text in the database without the correct key and decryption step.",
  },
  {
    title: "How Authentication Protects Access",
    body:
      "When you log in successfully, the server creates a signed JWT token containing your email and an expiry time. The frontend stores that token and sends it in the Authorization header on protected requests. On the backend, middleware verifies the token using the server secret. If the token is missing, invalid, or expired, the request is rejected with an unauthorized response and the protected data is not returned.",
  },
  {
    title: "How Token-Based Requests Work",
    body:
      "A typical protected request works like this: 1. you log in, 2. the server signs a token, 3. the app sends that token with requests, 4. middleware verifies it, and 5. only then does the server read or return the authenticated user's data. In our app, the verified token is attached to the request and used to identify the current user's email before loading records.",
  },
  {
    title: "Important Accuracy Note",
    body:
      "Our encryption is designed to protect stored data from unauthorized access and from being saved as plain text. However, because the application includes controlled decryption logic for authorized operations, we do not claim that the service can never read data under any circumstance. The accurate statement is that access is restricted, authenticated, and protected by encryption and server-side verification.",
  },
  {
    title: "Changes To This Policy",
    body:
      "We may update or change this Privacy Policy in the future as this software evolves, security practices improve, or legal requirements change. Any updated version will reflect the latest privacy practices followed by this software.",
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-6 md:px-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-[#7367f0]">
                  Legal
                </p>
                <h1 className="mt-2 text-2xl font-bold text-gray-800 md:text-3xl">
                  Privacy Policy
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600 md:text-base">
                  This page explains in plain language how this software stores data,
                  encrypts sensitive values, and protects access through
                  authenticated requests.
                </p>
              </div>
              <div className="hidden rounded-xl bg-[#7367f0]/10 p-4 text-[#7367f0] md:block">
                <FileText size={28} />
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-6 py-6 md:grid-cols-3 md:px-8">
            {securityCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-5"
                >
                  <div className="mb-3 inline-flex rounded-lg bg-[#7367f0]/10 p-3 text-[#7367f0]">
                    <Icon size={18} />
                  </div>
                  <h2 className="text-base font-semibold text-gray-800">
                    {card.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {card.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
          <div className="rounded-2xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-6 py-4 md:px-8">
              <h2 className="text-lg font-semibold text-gray-800">
                Privacy Details
              </h2>
            </div>
            <div className="space-y-8 px-6 py-6 md:px-8">
              {sections.map((section) => (
                <article key={section.title}>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {section.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-gray-600 md:text-base">
                    {section.body}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Encryption Format
                </h2>
              </div>
              <div className="space-y-4 px-6 py-6">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Before Saving
                  </p>
                  <p className="mt-2 break-words text-sm text-gray-800">
                    John Doe, 21 Lake Road, Mumbai
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    After Encryption
                  </p>
                  <p className="mt-2 break-all font-mono text-xs text-[#7367f0]">
                    enc:8f4a7c2e91bd...:3cd9a11f7b48...
                  </p>
                </div>
                <p className="text-sm leading-6 text-gray-600">
                  The encrypted value is the format stored in the database
                  instead of the original plain text.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Request Flow
                </h2>
              </div>
              <div className="space-y-4 px-6 py-6 text-sm leading-6 text-gray-600">
                <p>
                  1. User logs in with email and password.
                </p>
                <p>
                  2. Server checks the credentials and signs a JWT token.
                </p>
                <p>
                  3. Frontend sends that token in the{" "}
                  <span className="font-medium text-gray-800">
                    Authorization
                  </span>{" "}
                  header.
                </p>
                <p>
                  4. Middleware verifies the token before any protected route
                  continues.
                </p>
                <p>
                  5. If verification fails, access is denied with a 401
                  response.
                </p>
              </div>
            </section>
          </div>
        </section>

        <footer className="rounded-2xl border border-gray-200 bg-white px-6 py-5 md:px-8">
          <div className="flex flex-col gap-3 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
            <p>
              For support, use{" "}
              <a
                href="mailto:tanaykulkarnibusiness@gmail.com"
                className="font-medium text-[#7367f0] hover:underline"
              >
                Contact Us
              </a>{" "}
              for any assistance.
            </p>
            <Link to={-1} className="font-medium text-[#7367f0] hover:underline">
              Go back
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
