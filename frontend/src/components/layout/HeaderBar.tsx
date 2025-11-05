import { useAuth } from "../../providers/AuthProvider";
import { useNavigate } from "react-router-dom";

type HeaderBarProps = {
  onMenuClick: () => void;
};

const tabs = ["Market", "Wallets", "Tools"];

export const HeaderBar = ({ onMenuClick }: HeaderBarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <div className="flex items-center gap-4 px-4 py-4 sm:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 text-slate-300 transition hover:text-white lg:hidden"
          aria-label="Toggle navigation menu"
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
              d="M4 7h16M4 12h16M4 17h16"
            />
          </svg>
        </button>

        <div className="hidden items-center gap-1 rounded-full border border-slate-700 bg-slate-800 px-1 py-1 text-sm font-medium text-slate-300 md:flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className="rounded-full px-4 py-1.5 transition hover:bg-slate-700"
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-1 items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35m1.6-4.65a6.25 6.25 0 1 1-12.5 0 6.25 6.25 0 0 1 12.5 0z"
              />
            </svg>
            <input
              type="search"
              placeholder="Ask stocks.ai anything"
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 text-slate-300 transition hover:text-white"
              aria-label="View notifications"
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
                  d="M10 21h4m-7-6a7 7 0 0 1 14 0v2l1 1v1H6v-1l1-1v-2Zm3-7a2 2 0 1 1 4 0"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 text-slate-300 transition hover:border-red-500 hover:text-red-500"
              aria-label="Logout"
              title="Logout"
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
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
            </button>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
                AL
              </div>
              <div className="hidden text-sm leading-tight sm:block">
                <p className="font-semibold text-slate-100">Alyssa Stone</p>
                <p className="text-xs text-slate-400">alyssa@stovest.ai</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
