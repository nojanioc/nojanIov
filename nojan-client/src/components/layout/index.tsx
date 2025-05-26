import { getUserRole } from "@/utils/token";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Menu from "./menu";

const Layout = ({ children }: { children: React.ReactElement }) => {
  const auth = useSession();

  const userRole = auth.data?.user?.token
    ? getUserRole(auth.data.user.token)
    : null;
  const isAdmin = userRole === "admin";

  const data = [
    {
      name: "home",
      url: "/",
      label: "خانه",
    },
    ...(isAdmin
      ? [
          {
            name: "users",
            url: "/users",
            label: "کاربران",
          },
        ]
      : []),
    {
      name: "stats-bars",
      url: "/stats",
      label: "آمار",
    },
  ];

  const logout = {
    name: "exit",
    label: "خروج",
    action: () => {
      signOut({ callbackUrl: "/login" });
    },
  };

  const { asPath } = useRouter();

  return (
    <div className="w-full min-h-screen flex gap-2 lg:gap-4 flex-col md:flex-row p-4 bg-gray-50">
      {/* Sidebar */}
      <div className="fixed top-0 right-0 md:right-4 md:top-4 flex flex-col items-center justify-between rounded-2xl py-4 px-4 md:w-40 w-full md:h-[calc(100vh-2rem)] h-20 bg-white shadow-lg z-50">
        <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-6">
          {data.map((d) => {
            const isActive = asPath === d.url;
            return (
              <div key={d.name} className="flex items-center gap-3">
                <Menu isActive={isActive} d={d} />
              </div>
            );
          })}
        </div>
        <div className="md:flex hidden items-center gap-3 mt-6 md:mt-0">
          <Menu isActive={false} d={logout} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:mr-44 mt-20 md:mt-0">
        <div className="bg-white rounded-2xl shadow-lg md:p-6 p-2 h-full overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
