import { useRouter } from "next/router";
import FollowBar from "./Layout/FollowBar";
import Sidebar from "./Layout/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  return (
    <div className="h-screen bg-black">
      <div className="container h-full mx-auto xl:px-30 max-w:6xl">
        <div className="grid grid-cols-4 h-full">
          <Sidebar />
          <div
            className={`col-span-3 lg:${
              router.pathname === "/messages" ? "col-span-3" : "col-span-2"
            } border-x-[1px] border-neutral-800`}
          >
            {children}
          </div>
          <FollowBar onMessages={router.pathname === "/messages"} />
        </div>
      </div>
    </div>
  );
};

export default Layout;
