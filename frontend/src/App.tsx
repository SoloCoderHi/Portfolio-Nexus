import { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";
import { SideNav } from "./components/layout/SideNav";
import { HeaderBar } from "./components/layout/HeaderBar";

export const App = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleToggleNav = useCallback(() => {
    setIsMobileNavOpen((prev) => !prev);
  }, []);

  const handleCloseNav = useCallback(() => {
    setIsMobileNavOpen(false);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <SideNav isMobileOpen={isMobileNavOpen} onClose={handleCloseNav} />
      <div className="flex flex-1 flex-col">
        <HeaderBar onMenuClick={handleToggleNav} />
        <main className="flex-1 overflow-y-auto bg-slate-900/60 px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default App;
