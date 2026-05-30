"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Mail, ChevronDown, LogOut, Settings, User, Bell, Zap,
  ChevronRight, ShieldCheck, CreditCard, MessageSquare, Search
} from "lucide-react";

export default function Navbar({ userName = "Developer", userEmail = "user@mailtrap.local" }) {
  const { logout } = useAuth();
  const pathname = usePathname();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navLinks = [
    { label: "Testing", href: "/sendbox" },
    { label: "Domain", href: "/domain" },
    { label: "Sendbox", href: "/sendbox" },
    { label: "API", href: "/smtp" },
  ];

  const initials = userName.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();

  const breadcrumbs = pathname?.split("/").filter(Boolean) || [];

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between h-[60px] px-6
      bg-[#0d0f14]/80 backdrop-blur-xl border-b border-white/10">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/5">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white">
            <Mail size={16}/>
          </div>
          <span className="font-bold">Mail<span className="text-green-400">trap</span></span>
        </Link>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-400 gap-1">
          {breadcrumbs.length === 0 ? (
            <span>Dashboard</span>
          ) : (
            breadcrumbs.map((b, i) => (
              <div key={i} className="flex items-center gap-1">
                <span>{b}</span>
                {i < breadcrumbs.length - 1 && <ChevronRight size={12} />}
              </div>
            ))
          )}
        </div>
      </div>

      {/* CENTER */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-1 rounded-md text-sm flex items-center gap-1
              ${pathname?.includes(link.href)
                ? "bg-[#1a1e2b] text-white"
                : "text-gray-400 hover:text-white hover:bg-white/10"}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* Search */}
        <div className="flex items-center gap-2 px-3 h-9 bg-[#13161e] border border-white/10 rounded-md text-gray-400 text-sm">
          <Search size={14}/>
          Search
          <kbd className="ml-2 text-xs bg-black/30 px-1 rounded">⌘K</kbd>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-xs">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
          Live
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-white/10"
          >
            <Bell size={18}/>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#1a1e2b] border border-white/10 rounded-lg p-4 shadow-lg">
              <p className="text-sm text-gray-400">No notifications</p>
            </div>
          )}
        </div>

        {/* Upgrade */}
        <Link href="/subscriptions"
          className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-md text-sm hover:opacity-90">
          <Zap size={14}/>
          Upgrade
        </Link>

        {/* USER */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-[#13161e] border border-white/10 px-2 py-1 rounded-full"
          >
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white">
              {initials}
            </div>
            <ChevronDown size={14}/>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#1a1e2b] border border-white/10 rounded-lg shadow-lg p-2">

              <div className="p-3 border-b border-white/10">
                <p className="text-sm font-semibold">{userName}</p>
                <p className="text-xs text-gray-400">{userEmail}</p>
              </div>

              <button className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-white/10 rounded">
                <User size={16}/> Profile
              </button>

              <button className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-white/10 rounded">
                <Settings size={16}/> Settings
              </button>

              <button className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-white/10 rounded">
                <CreditCard size={16}/> Billing
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded"
              >
                <LogOut size={16}/> Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </nav>
  );
}