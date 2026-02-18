"use client";

import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/dashboard",
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header Section (Same structure as dashboard) */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Smart Bookmark</h1>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md space-y-6 text-center">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-700">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm">
              Login to manage your bookmarks securely
            </p>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-2 rounded-lg 
                       hover:bg-gray-800 transition"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
