import { Link } from "react-aria-components";
import { CalculatorIcon as AppIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
// import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { sidebarNavItems } from "@/pages/Dashboard/nav-items";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const SidebarCondensedNavigation = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <AppIcon className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">MathHub</span>
        </Link>
        {sidebarNavItems.map(({ path, title, Icon }) => (
          <Tooltip key={path}>
            <TooltipTrigger asChild>
              <Link
                href={path}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                  location.pathname === path
                    ? "bg-accent text-accent-foreground"
                    : "",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="sr-only">{title}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{title}</TooltipContent>
          </Tooltip>
        ))}
      </nav>
      {/* <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav> */}
    </aside>
  );
};
const SidebarNavigation = () => {
  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <AppIcon className="h-6 w-6 text-primary" />
          <span className="text-primary">MathHub</span>
        </Link>
        {/* <Button
          variant="outline"
          size="icon"
          className="ml-auto h-8 w-8 hidden md:flex"
        >
          <Bell className="h-4 w-4" />
          <span className="sr-only">Toggle notifications</span>
        </Button> */}
      </div>
      <div className="flex-1">
        <NavMenuContent />
      </div>
      {/* <div className="mt-auto">
        <Card className="rounded-none p-2 bg-muted">sidebar footer</Card>
      </div> */}
    </div>
  );
};

export default SidebarNavigation;

export const NavMenuContent = () => {
  const location = useLocation();
  return (
    <nav className="grid gap-2 md:gap-0 items-start px-2  text-lg md:text-sm font-medium lg:px-4">
      {sidebarNavItems.map(({ path, Icon, title, badge }) => (
        <Link
          key={path}
          href={path}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            location.pathname === path ? "bg-muted text-primary" : "",
          )}
        >
          <Icon className="h-4 w-4" />
          {title}
          {badge && badge !== 0 && (
            <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
              {badge}
            </Badge>
          )}
        </Link>
      ))}
    </nav>
  );
};
