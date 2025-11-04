'use client';

import Link from "next/link";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-white text-6xl font-bold mb-4">404</h1>
        <p className="text-white/70 text-xl mb-6">Oops! Page not found</p>
        <Link
          href="/"
          className="inline-block bg-[#CEFE10] hover:bg-[#b8e80d] text-black font-bold py-3 px-6 rounded-full transition-colors duration-200"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
