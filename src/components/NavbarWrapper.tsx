"use client";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

// Pages that should NOT show the navbar
const AUTH_ROUTES = ["/login", "/register"];

export default function NavbarWrapper() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const isAuthPage = AUTH_ROUTES.some((route) => pathname?.startsWith(route));

  if (!isAuthenticated || isAuthPage) return null;

  return <Navbar />;
}
