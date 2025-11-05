import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Analysis", to: "/analysis" },
  { label: "Market", to: "/market" },
];

const supportItems = [
  { label: "Community", to: "/community" },
  { label: "Help & Support", to: "/support" },
];

type SideNavProps = {
  isMobileOpen: boolean;
  onClose: () => void;
};

const navLinkBase =
  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors";

const navLinkActive =
  "bg-indigo-500/20 text-indigo-200 ring-1 ring-inset ring-indigo-400";

const navLinkInactive = "text-slate-300 hover:bg-slate-800 hover:text-white";

const NavSectionTitle = ({ title }: { title: string }) => (
  <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
    {title}
  </p>
);

export const SideNav = ({ isMobileOpen, onClose }: SideNavProps) => {
  return (
    <>
      <div
        className={[
          "fixed inset-y-0 left-0 z-50 w-72 transform bg-slate-900/95 backdrop-blur-xl transition-transform duration-300 ease-in-out",
          "lg:static lg:z-auto lg:flex lg:w-64 lg:translate-x-0 lg:bg-slate-900/70",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <nav className="flex h-full flex-col justify-between px-6 py-8">
          <div>
            <div className="mb-10 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500 text-lg font-semibold text-white">
                S
              </div>
              <span className="text-xl font-semibold text-white">Stovest</span>
            </div>

            <NavSectionTitle title="Main" />
            <div className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    [
                      navLinkBase,
                      isActive ? navLinkActive : navLinkInactive,
                    ].join(" ")
                  }
                  onClick={onClose}
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-300">
                    {item.label[0]}
                  </span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <NavSectionTitle title="Support" />
            <div className="space-y-1">
              {supportItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      navLinkBase,
                      isActive ? navLinkActive : navLinkInactive,
                    ].join(" ")
                  }
                  onClick={onClose}
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-300">
                    {item.label[0]}
                  </span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        <button
          type="button"
          aria-label="Close navigation"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 text-slate-400 transition hover:text-white lg:hidden"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 6l12 12M6 18L18 6"
            />
          </svg>
        </button>
      </div>

      {isMobileOpen && (
        <button
          type="button"
          aria-label="Dismiss navigation overlay"
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default SideNav;
