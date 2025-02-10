"use client";

import { useAuthContext } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { user, decodeToken } = useAuthContext();

  const router = useRouter();

  useEffect(() => {
    if (user) {
      localStorage.removeItem("store");

      if (user.role === "ADMIN") {
        router.push("/dashboard");
      }

      if (user.role === "MANAGER") {
        router.push("/dashboard");
      }

      if (user.role === "CUSTOMER") {
        router.push("/profile");
      }
    }
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    decodeToken(token);
  }, []);

  return <>{children}</>;
}
