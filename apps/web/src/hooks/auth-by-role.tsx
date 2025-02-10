"use client";

import { type Role, useAuthContext } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const authByRole = <T extends object>(Component: React.FC<T>, roles: Role[] | "all") => {
  return (props: T) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const { logOut, decodeToken } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        logOut();
        router.push("/login");
      }

      async function getUserByToken() {
        const user = await decodeToken(token);

        if (!user) {
          router.push("/login");
          return;
        }

        if (roles !== "all") {
          if (!roles.includes(user.role)) {
            router.push("/login");
          }
        }

        setIsAuthenticated(true);
      }

      getUserByToken();
    }, []);

    return isAuthenticated ? <Component {...props} /> : <></>;
  };
};

export default authByRole;
