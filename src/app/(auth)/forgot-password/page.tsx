'use client'

import {useEffect, useState} from "react";
import Link from "next/link";
import {ApiError, usePageTitle} from "@/lib";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { setTitle } = usePageTitle();

  useEffect(() => {
    if (isSubmitted) {
      setTitle("Check Your Email");
    } else {
      setTitle(
        "Forgot Your Password?",
        "No worries! Enter your email and we'll send you a reset link."
      );
    }
  }, [isSubmitted, setTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement password reset request when backend supports it
      // For now, simulate the flow
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (err: unknown) {
      setError((err as ApiError).message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="glass p-8 mb-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#CEFE10] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <p className="text-white/90 mb-4">
            {"We've sent a password reset link to"} <strong>{email}</strong>
          </p>

          <p className="text-white/70 text-sm mb-6">
            Check your email and follow the link to reset your password. The link will expire in 24 hours.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-white/70 text-sm">{"Didn't receive an email?"}</p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setEmail("");
            }}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200"
          >
            Try another email
          </button>

          <Link
            href="/login"
            className="w-full block text-center bg-[#CEFE10] hover:bg-[#b8e80d] text-black font-bold py-3 px-6 rounded-full transition-colors duration-200"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="glass p-8 mb-6">
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-black/30 border border-white/20 rounded-full px-5 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10] transition-colors duration-200"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !email.trim()}
          className="w-full bg-[#CEFE10] hover:bg-[#b8e80d] disabled:opacity-50 text-black font-bold py-4 px-6 rounded-full transition-colors duration-200"
        >
          {isLoading ? "SENDING..." : "SEND RESET LINK"}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gradient-to-b from-[#0a1628] to-[#1a2847] text-white/70">or</span>
        </div>
      </div>

      <Link
        href="/login"
        className="block text-center bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200"
      >
        Back to Login
      </Link>
    </div>
  );
}
