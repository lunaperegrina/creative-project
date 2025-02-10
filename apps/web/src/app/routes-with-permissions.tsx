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
    roles: ["ADMIN", "MANAGER"],
  },
  {
    name: "Inventário",
    route: "/inventory",
    icon: Archive,
    roles: ["ADMIN", "MANAGER"],
  },
  {
    name: "Usuários",
    route: "/users",
    icon: Users,
    roles: ["ADMIN", "MANAGER"],
  },
  {
    name: "Pedidos",
    route: "/orders",
    icon: ListOrdered,
    roles: ["ADMIN", "MANAGER", "CUSTOMER"],
    separatorTop: true,
  },
  {
    name: "Configurações",
    route: "/settings",
    icon: Settings,
    roles: ["ADMIN", "MANAGER", "CUSTOMER"],
    separatorTop: true,
  },
  {
    name: "Sair",
    route: "/logout",
    roles: ["ADMIN", "MANAGER", "CUSTOMER"],
    icon: DoorOpen,
    className:
      "text-red-500 hover:bg-red-100 hover:text-red-900 dark:text-red-400 dark:hover:bg-red-800 dark:hover:text-red-50 p-4 w-full justify-start gap-2",
  },
];

export default RoutesWithPermissions;
