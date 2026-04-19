"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { LockClosedIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 shadow-2xl rounded-2xl w-full max-w-md border border-gray-100 transition-all hover:shadow-blue-100"
      >
        <h1 className="text-3xl font-bold mb-2 text-center text-blue-700">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Login to continue to your dashboard
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-2 text-center rounded mb-4">
            {error}
          </div>
        )}

        <div className="relative mb-4">
          <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative mb-6">
          <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* <p className="text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up
          </a>
        </p> */}
      </form>
    </div>
  );
}
