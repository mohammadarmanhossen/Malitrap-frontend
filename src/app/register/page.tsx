"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/auth/register/", {
        username,
        email,
        password,
      });

      router.push("/login");
    } catch {
      setError("Registration failed. Username or email may already exist.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* TOP NAVBAR */}
      <header className="flex justify-between items-center sticky px-10 py-4 border-b">
        <div className="flex items-center">
          <Mail className="text-green-500 mr-2" />
          <h1 className="text-lg font-bold text-gray-800">Mailtrap</h1>
        </div>

        <div className="space-x-3">
          <Link
            href="/login"
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Log In
          </Link>

          <Link
            href="/register"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex flex-1">

        {/* LEFT - FORM */}
        <section className="w-full md:w-1/2 flex items-center justify-center px-8 md:px-16">
          <div className="w-full max-w-md">

            <h2 className="text-3xl font-bold text-gray-900">
              Create Account
            </h2>

            <p className="text-sm text-gray-500 mt-2 mb-6">
              Sign up using your details
            </p>

            {/* ERROR */}
            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="text-sm text-gray-600">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition"
              >
                Sign Up
              </button>
            </form>

            <p className="mt-6 text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-green-600 hover:underline">
                Sign in
              </Link>
            </p>

          </div>
        </section>

          {/* RIGHT - IMAGE */}
        <section className="hidden md:flex w-1/2 bg-green-50 items-center justify-center">
          <img
            src="https://illustrations.popsy.co/gray/digital-nomad.svg"
            alt="Login Illustration"
            className="w-3/4"
          />
        </section>

      </main>
     <footer className="bg-white border-t border-gray-200 pt-16 pb-8 px-8 font-sans text-[#1b2332]">
        {/* TOP SECTION: 6-Column Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 mb-16">

          {/* Column 1: Logo/Branding */}
          <div className="col-span-1">
            <div className="border border-gray-200 rounded-lg p-3 w-28 h-28 flex flex-col items-center justify-center text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
              <span className="mb-1 opacity-70">Crafted by</span>
              <div className="flex gap-0.5 mb-1">
                <div className="w-2 h-5 bg-[#22d3ee] -skew-x-12"></div>
                <div className="w-2 h-5 bg-[#22d3ee] -skew-x-12 opacity-80"></div>
                <div className="w-2 h-5 bg-[#22d3ee] -skew-x-12 opacity-60"></div>
              </div>
              <span className="text-[#1b2332] tracking-normal lowercase text-sm">railsware</span>
            </div> 
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="font-bold text-[14px] mb-5">Product</h4>
            <ul className="space-y-3 text-[13px] text-gray-600">
              <li><a href="#" className="hover:text-[#22d3ee] transition">Pricing</a></li>
              <li><a href="#" className="hover:text-[#22d3ee] transition">Status</a></li>
              <li><a href="#" className="hover:text-[#22d3ee] transition">Changelog</a></li>
              <li><a href="#" className="hover:text-[#22d3ee] transition">Public roadmap</a></li>
              <li><a href="#" className="hover:text-[#22d3ee] transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#22d3ee] transition">Terms of Service</a></li>
            </ul>
          </div>

          {/* Column 3: Email Sandbox & API */}
          <div>
            <h4 className="font-bold text-[14px] mb-5">Email Sandbox</h4>
            <ul className="space-y-3 text-[13px] text-gray-600 mb-8">
              <li><a href="#" className="hover:text-[#22d3ee]">Fake SMTP</a></li>
              <li><a href="#" className="hover:text-[#22d3ee]">HTML Checker</a></li>
              <li><a href="#" className="hover:text-[#22d3ee]">Spam Checker</a></li>
            </ul>
            <h4 className="font-bold text-[14px] mb-5">Email API/SMTP</h4>
            <ul className="space-y-3 text-[13px] text-gray-600">
              <li><a href="#" className="hover:text-[#22d3ee]">Email API</a></li>
              <li><a href="#" className="hover:text-[#22d3ee]">SMTP Service</a></li>
            </ul>
          </div>

          {/* Column 4: How to Switch */}
          <div>
            <h4 className="font-bold text-[14px] mb-5">How to switch</h4>
            <ul className="space-y-3 text-[13px] text-gray-600 mb-8">
              <li><a href="#" className="hover:text-[#22d3ee]">Migration from SendGrid</a></li>
              <li><a href="#" className="hover:text-[#22d3ee]">Migration from Mailgun</a></li>
            </ul>
            <h4 className="font-bold text-[14px] mb-5">Mailtrap VS</h4>
            <ul className="space-y-3 text-[13px] text-gray-600">
              <li><a href="#" className="hover:text-[#22d3ee]">Mailtrap vs SendGrid</a></li>
              <li><a href="#" className="hover:text-[#22d3ee]">Mailtrap vs Mailgun</a></li>
            </ul>
          </div>

          {/* Column 5: Resources */}
          <div>
            <h4 className="font-bold text-[14px] mb-5">Helpful resources</h4>
            <ul className="space-y-3 text-[13px] text-gray-600">
              <li><a href="#" className="hover:text-[#22d3ee]">Mailtrap Blog</a></li>
              <li><a href="#" className="hover:text-[#22d3ee]">Help center</a></li>
              <li><a href="#" className="hover:text-[#22d3ee]">Partner program</a></li>
              <li><a href="#" className="hover:text-[#22d3ee]">Brand assets</a></li>
            </ul>
          </div>

          {/* Column 6: Contact & Badges */}
          <div>
            <h4 className="font-bold text-[14px] mb-5">Contact</h4>
            <p className="text-[13px] text-gray-600 mb-5">email: support[at]mailtrap.io</p>

            {/* Social Icons Placeholder */}
            <div className="flex gap-2 mb-10">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 cursor-pointer transition">
                  <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
                </div>
              ))}
            </div>

            {/* Compliance Badges */}
            <div className="space-y-4 opacity-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center font-bold text-[8px]">GDPR</div>
                <span className="text-[10px] font-bold uppercase leading-tight">GDPR<br />Compliant</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center font-bold text-[8px]">SOC2</div>
                <span className="text-[10px] font-bold uppercase leading-tight">SOC 2<br />Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Legal & Language */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-[12px] text-gray-500">
          <div className="flex items-center gap-1 mb-4 md:mb-0">
            <span>© Railsware Products Studio LLC</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 cursor-pointer hover:text-black">
              <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
              <span className="font-medium">EN</span>
              <span className="text-[8px] mt-0.5">▼</span>
            </div>
            <a href="#" className="hover:text-black">Railsware Blog</a>
            <a href="#" className="hover:text-black">Coupler.io</a>
            <a href="#" className="hover:text-black">titanapps.io</a>
          </div>
        </div>
      </footer>

    </div>
  );
}