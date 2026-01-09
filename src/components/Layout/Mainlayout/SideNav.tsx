import { useState, useCallback, useMemo, useEffect } from "react";
import { BookOpen, LayoutDashboard, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { appRoutes } from "@/routes/appRoutes";

const SideNav = () => {
  const navigate = useNavigate();

  const [activeRoute, setActiveRoute] = useState("/dashboard");
  const [isHovered, setIsHovered] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const currentPath = window.location.pathname;
    setActiveRoute(currentPath);
  }, []);

  const navigationItems = useMemo(
    () => [
      {
        label: "Home",
        path: appRoutes.dashboard,
        icon: LayoutDashboard,
        section: "main",
      },
      {
        label: "Course Management",
        path: appRoutes.course.path,
        icon: BookOpen,
        section: "main",
      },
    ],
    []
  );

  const handleLogout = useCallback(() => {
    console.log("Logging out...");
    setShowLogoutConfirm(false);
  }, []);

  return (
    <>
      <div
        className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[#d1d3d9] bg-white transition-all duration-200 ease-in-out"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ width: isHovered ? "280px" : "72px" }}
      >
        {/* Logo Section */}
        <div className="flex shrink-0 items-center border-b border-[#d1d3d9] py-2 px-4">
          <div className="flex min-w-0 items-center justify-center gap-3">
            <img className="self-center mx-auto" src="/logs1.webp" width={32} />
            <div
              className="flex min-w-0 flex-col transition-all duration-200 ease-in-out"
              style={{
                opacity: isHovered ? 1 : 0,
                visibility: isHovered ? "visible" : "hidden",
              }}
            >
              <span className="truncate text-sm font-semibold text-slate-900">
                Certification
              </span>
              <span className="truncate text-xs text-slate-500">
                Admin Portal
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="scrollbar-hide flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-2 gap-1.5 flex flex-col">
            {/* Navigation Items */}
            {navigationItems.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => {
                  // setActiveRoute(item.path);
                  navigate(item.path);
                }}
                className={`group relative flex w-max mx-auto items-center rounded-md transition-all duration-200 ease-in-out ${
                  activeRoute === item.path
                    ? "bg-gray-100 text-black "
                    : "text-black hover:bg-gray-100"
                } ${isHovered ? "gap-3 px-3 py-2.5 w-full!" : "justify-center px-3 py-2.5"}`}
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                  <item.icon className="h-5 w-5" />
                </div>
                <span
                  className="min-w-0 truncate text-sm font-medium transition-all duration-200 ease-in-out"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    width: isHovered ? "auto" : "0",
                    visibility: isHovered ? "visible" : "hidden",
                  }}
                >
                  {item.label}
                </span>

                {/* Tooltip for collapsed state */}
                {!isHovered && (
                  <div className="pointer-events-none absolute left-full ml-2 hidden rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white opacity-0  transition-opacity duration-150 group-hover:block group-hover:opacity-100">
                    <span className="whitespace-nowrap">{item.label}</span>
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Logout Section */}
        <div className="shrink-0 border-t border-[#d1d3d9] p-2">
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className={`group relative flex w-full items-center rounded-lg text-slate-700 transition-all duration-200 ease-in-out hover:bg-red-50 hover:text-red-600 ${
              isHovered ? "gap-3 px-3 py-2.5" : "justify-center px-3 py-2.5"
            }`}
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center">
              <LogOut className="h-5 w-5" />
            </div>
            <span
              className="min-w-0 truncate text-sm font-medium transition-all duration-200 ease-in-out"
              style={{
                opacity: isHovered ? 1 : 0,
                width: isHovered ? "auto" : "0",
                visibility: isHovered ? "visible" : "hidden",
              }}
            >
              Logout
            </span>

            {/* Tooltip for collapsed state */}
            {!isHovered && (
              <div className="pointer-events-none absolute left-full ml-2 hidden rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white opacity-0  transition-opacity duration-150 group-hover:block group-hover:opacity-100">
                <span className="whitespace-nowrap">Logout</span>
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
            style={{ animation: "fadeIn 0.15s ease-out" }}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="w-full max-w-md rounded-xl bg-white p-6 "
              style={{ animation: "scaleIn 0.15s ease-out" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-slate-900">
                Confirm Logout
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Are you sure you want to log out? You'll need to sign in again
                to access your account.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Spacer for content layout */}
      <div className="w-[72px] shrink-0" />

      <style>{`
        /* Hide scrollbar while maintaining functionality */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
      `}</style>
    </>
  );
};

export default SideNav;
