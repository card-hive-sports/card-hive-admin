'use client'

import {useEffect, useState} from "react";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {ApiError, authAPI, usePageTitle} from "@/lib";
import {AxiosError} from "axios";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const token = searchParams.get("token");

  const { setTitle } = usePageTitle();

  useEffect(() => {
    if (token) {
      if (isSubmitted) {
        setTitle("Password Reset!");
      } else {
        setTitle(
          "Reset Your Password?",
          "Enter your new password below."
        );
      }
    }
  }, [isSubmitted, setTitle, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Both fields are required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    setIsLoading(true);

    try {
      await authAPI.resetPassword({ token, password });
      setIsSubmitted(true);
    } catch (err: unknown) {
      const error = err as AxiosError<ApiError>;
      setError(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="glass p-8 text-center">
        <h2 className="text-white text-xl font-bold mb-4">Invalid Reset Link</h2>
        <p className="text-white/70 mb-6">This reset link is invalid or has expired.</p>
        <Link
          href="/login"
          className="block bg-[#CEFE10] hover:bg-[#b8e80d] text-black font-bold py-3 px-6 rounded-full transition-colors duration-200"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="glass p-8 mb-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#CEFE10] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <p className="text-white/90 mb-2">Your password has been successfully reset!</p>
          <p className="text-white/70 text-sm">You can now log in with your new password.</p>
        </div>

        <Link
          href="/login"
          className="block w-full text-center bg-[#CEFE10] hover:bg-[#b8e80d] text-black font-bold py-3 px-6 rounded-full transition-colors duration-200"
        >
          Go to Login
        </Link>
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

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* New Password */}
        <div>
          <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/30 border border-white/20 rounded-full px-5 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10] transition-colors duration-200 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90 transition-colors"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          <p className="text-white/50 text-xs mt-1">At least 8 characters</p>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-white text-sm font-medium mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/30 border border-white/20 rounded-full px-5 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10] transition-colors duration-200 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90 transition-colors"
            >
              {showConfirmPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#CEFE10] hover:bg-[#b8e80d] disabled:opacity-50 text-black font-bold py-4 px-6 rounded-full transition-colors duration-200 mt-6"
        >
          {isLoading ? "RESETTING..." : "RESET PASSWORD"}
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
