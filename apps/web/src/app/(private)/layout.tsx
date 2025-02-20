"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { type UserAuthProps, useAuthContext } from "@/contexts/auth.context";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import RoutesWithPermissions, { type RoutesWithPermissionsProps } from "../routes-with-permissions";
import Loading from "@/components/loading";
import { User } from "lucide-react";

function Header() {
  return (
    <div className="flex flex-1 items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold">Alfa Manager</h1>
      </div>
      <div className="flex items-center">
        <Button variant="outline" className="h-12 rounded-full" asChild>
          <Link href="/profile">
            <User className="w-10 h-10" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default function Navbar({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useAuthContext();

  return (
    <div className="mx-auto my-8 container">
      <div className="xl:hidden max-xl:mx-4">
        <NavbarMobile user={user} />
        <main className="pt-10 pb-8 w-full">{children}</main>
      </div>
      <div className="hidden xl:flex xl:flex-col xl:gap-4 xl:container xl:mx-auto">
        <Header />
        <div className="flex flex-row gap-4">
          <NavbarDesktop user={user} />
          {!user && (
            <div className="w-screen h-screen flex justify-center items-center">
              <Loading />
            </div>
          )}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

function RenderNavButton(
  button: RoutesWithPermissionsProps,
  pathname: string,
  setSheetOpen?: React.Dispatch<React.SetStateAction<boolean>>
) {
  return (
    <div key={button.name}>
      {button.separatorTop && <Separator />}
      <Button
        key={button.name}
        variant="ghost"
        size="lg"
        onClick={() => {
          setSheetOpen?.(false);
        }}
        className={
          button.route === pathname
            ? "bg-gray-100 w-full justify-start p-4"
            : button.className
              ? button.className
              : "p-4 w-full justify-start gap-2 "
        }
        asChild
      >
        <Link href={button.route} className="flex justify-between">
          <div className="flex gap-2">
            <button.icon className="w-5 h-5" />
            {button.name}
          </div>
        </Link>
      </Button>
    </div>
  );
}

function NavbarLinks({
  user,
  pathname,
  setSheetOpen,
}: {
  user: UserAuthProps | null;
  pathname: string;
  setSheetOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="xl:mt-4 w-full">
      {RoutesWithPermissions.filter((button) => button.roles.includes(user.role)).length === 0 && <>aaaa</>}
      {RoutesWithPermissions.filter((button) => button.roles.includes(user.role)).map((button) =>
        RenderNavButton(button, pathname, setSheetOpen)
      )}
    </div>
  );
}

function NavbarDesktop({ user }: { user: UserAuthProps | null }) {
  const pathname = usePathname();
  return (
    <nav className="w-56">
      <div>
        <NavbarLinks user={user} pathname={pathname} />
      </div>
    </nav>
  );
}

function NavbarMobile({ user }: { user: UserAuthProps | null }) {
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const pathname = usePathname();

  return (
    <div className="flex flex-row items-center gap-4">
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild className="xl:hidden block">
          <div>
            <Button variant="outline" className="h-12">
              <Menu />
            </Button>
          </div>
        </SheetTrigger>
        <SheetContent side={"left"} className="gap-4 flex flex-col items-center max-[420px]:w-full overflow-x-auto">
          <SheetHeader>
            <SheetTitle>Alfa Manager</SheetTitle>
          </SheetHeader>
          <NavbarLinks user={user} setSheetOpen={setSheetOpen} pathname={pathname} />
        </SheetContent>
      </Sheet>
      <Header />
    </div>
  );
}
