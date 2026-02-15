import { SideNav, SideNavItems, SideNavLink } from "@carbon/react";
import {
  Dashboard as DashboardIcon,
  Search,
  Bookmark,
  Portfolio,
  Settings,
} from "@carbon/icons-react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { title: "Dashboard", url: "/", icon: DashboardIcon },
  { title: "Stock Explorer", url: "/explorer", icon: Search },
  { title: "Watchlist", url: "/watchlist", icon: Bookmark },
  { title: "AI Briefcase", url: "/briefcase", icon: Portfolio },
  { title: "Settings", url: "/settings", icon: Settings },
];

interface AppSidebarProps {
  expanded: boolean;
}

export function AppSidebar({ expanded }: AppSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <SideNav
      aria-label="Side navigation"
      expanded={expanded}
      isFixedNav
      className="fixed top-12 left-0 bottom-0 z-40"
    >
      <SideNavItems>
        {navItems.map((item) => {
          const isActive = item.url === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(item.url);
          return (
            <SideNavLink
              key={item.title}
              renderIcon={item.icon}
              isActive={isActive}
              onClick={() => navigate(item.url)}
              className="cursor-pointer"
            >
              {item.title}
            </SideNavLink>
          );
        })}
      </SideNavItems>
    </SideNav>
  );
}
