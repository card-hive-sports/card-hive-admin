'use client';

import Link from "next/link";
import {GameButton} from "@/lib/ui";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-white text-6xl font-bold mb-4">404</h1>
        <p className="text-white/70 text-xl mb-6">Oops! Page not found</p>
        <GameButton asChild size="lg">
          <Link href="/">Return to Home</Link>
        </GameButton>
      </div>
    </div>
  );
};

export default NotFound;
