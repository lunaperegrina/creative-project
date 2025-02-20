'use client'

import { TypographyH2 } from "@/components/typography";
import { useAuthContext } from "@/contexts/auth.context";
import authByRole from "@/hooks/auth-by-role";

function Dashboard() {

  const { user } = useAuthContext();

  return (
    <div>
      <TypographyH2>Dashboard</TypographyH2>
    </div>
  )
}

export default authByRole(Dashboard, ["ADMIN", "MANAGER"]);
