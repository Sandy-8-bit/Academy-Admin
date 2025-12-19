import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";
import { useFetchUserMe } from "@/queries/UserQuery";

const MainLayout: React.FC = () => {
  const { data, isLoading } = useFetchUserMe();

  // 👉 Extract user name safely
  const userName = data?.data?.name || "User";

  // 👉 Store user details in localStorage once fetched
  useEffect(() => {
    if (data?.data) {
      localStorage.setItem("userMe", JSON.stringify(data.data));
    }
  }, [data]);

  // 👉 Format date
  const formattedDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (isLoading) return null; // replace with loader if needed

  return (
    <div className="Main-entry-point flex h-screen w-screen flex-row overflow-hidden bg-[#FAFAFA]">
      <SideNav />

      <section className="flex h-full w-full flex-col overflow-hidden">
        {/* Top Navbar */}
        {/* <TopNav userName={userName} formattedDate={formattedDate} /> */}

        {/* Content */}
        <main
          id="layout"
          className="main-content flex-1 overflow-y-auto  pr-3 pb-24 md:pb-0  lg:pr-4"
        >
          <Outlet />
        </main>
      </section>
    </div>
  );
};

export default MainLayout;
