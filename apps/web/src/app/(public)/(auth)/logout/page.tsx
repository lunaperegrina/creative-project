"use client";

import { useAuthContext } from "@/contexts/auth.context";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
  const { logOut } = useAuthContext();

  useEffect(() => {
    if (typeof window !== "undefined") {
      logOut();
      redirect("/")
    }
  }, [logOut]);

  return <></>;
}
