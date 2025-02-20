import type { Role } from "@/contexts/auth.context";
import {
  Archive,
  ArchiveRestore,
  BookImage,
  DoorOpen,
  LayoutDashboard,
  ListOrdered,
  type LucideProps,
  Package,
  Receipt,
  Settings,
  Shirt,
  Store,
  Truck,
  Users,
  User,
  Barcode,
  LogOut,
} from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

interface ChildRoute {
  name: string;
  route: string;
}

export interface RoutesWithPermissionsProps {
  name: string;
  route: string;
  roles: Role[];
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  separatorTop?: boolean;
  dropdown?: boolean;
  childs?: ChildRoute[];
  className?: string;
}

const RoutesWithPermissions: RoutesWithPermissionsProps[] = [
  {
    name: "Dashboard",
    route: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN"],
  },
  // {
  //   name: "Inventário",
  //   route: "/inventory",
  //   icon: Archive,
  //   roles: ["ADMIN"],
  // },
  {
    name: "Usuários",
    route: "/users",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    name: "Pedidos",
    route: "/orders",
    icon: ListOrdered,
    roles: ["ADMIN", "CUSTOMER"],
    // separatorTop: true,
  },
  // {
  //   name: "Catálogo",
  //   route: "/catalog",
  //   icon: BookImage,
  //   roles: ["ADMIN", "CUSTOMER"],
  //   // separatorTop: true,
  // },
  {
    name: "Sair",
    route: "/logout",
    roles: ["ADMIN", "CUSTOMER"],
    icon: LogOut,
    // separatorTop: true,

    className:
      "text-red-500 hover:text-red-600 hover:bg-red-50 p-4 w-full justify-start gap-2",
  },
];

export default RoutesWithPermissions;
