"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Search } from "lucide-react";
import { apiGet } from "@/lib/api";

interface UserResponse {
  id: string;
  name: string;
  email: string;
}

export const WelcomeHeader: React.FC = () => {
  const [user, setUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await apiGet<UserResponse>("/auth/me");
        setUser(data);
      } catch (error) {
        console.error("Failed to load current user:", error);
      }
    }

    loadUser();
  }, []);

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Welcome back, {firstName} 👋
          </h1>

          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Hackathon Demo
          </span>
        </div>

        <p className="text-sm text-slate-400">
          Here is your executive meeting summary and commitment breakdown for{" "}
          <span className="text-indigo-300 font-medium">
            your projects
          </span>
          .
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

          <input
            type="text"
            placeholder="Search meetings..."
            className="w-56 bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>

        {/* Date Stamp */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};