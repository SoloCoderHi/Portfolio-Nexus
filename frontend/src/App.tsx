import { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";
import { SideNav } from "./components/layout/SideNav";
import { HeaderBar } from "./components/layout/HeaderBar";
import { FloatingActionButton } from "./components/shared/FloatingActionButton";
import { AddTransactionModal } from "./components/modals/AddTransactionModal";

export const App = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleNav = useCallback(() => {
    setIsMobileNavOpen((prev) => !prev);
  }, []);

  const handleCloseNav = useCallback(() => {
    setIsMobileNavOpen(false);
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-black text-slate-100">
      <SideNav isMobileOpen={isMobileNavOpen} onClose={handleCloseNav} />
      <div className="flex min-w-0 flex-1 flex-col">
        <HeaderBar onMenuClick={handleToggleNav} />
        <main className="flex-1 overflow-y-auto bg-black px-6 py-6">
          <Outlet />
        </main>
      </div>
      <FloatingActionButton onClick={() => setIsModalOpen(true)} />
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default App;
