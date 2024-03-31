import { Home, ShoppingCart, Package, Users, LineChart } from "lucide-react";

export const sidebarNavItems = [
  {
    title: "Dashboard",
    Icon: Home,
    path: "/",
  },
  {
    title: "Orders",
    Icon: ShoppingCart,
    path: "/orders",
    badge: 6,
  },
  {
    title: "Products",
    Icon: Package,
    path: "/products",
  },
  {
    title: "Customers",
    Icon: Users,
    path: "/customers",
  },
  {
    title: "Analytics",
    Icon: LineChart,
    path: "/analytics",
  },
];
