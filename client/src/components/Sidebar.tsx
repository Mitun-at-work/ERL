import { NavLink } from "react-router-dom";
import { Home, Heart, Video, Settings} from "lucide-react";

export default function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
      isActive ? "bg-[#2a2a2a] text-white" : "text-gray-400 hover:text-white hover:bg-[#1e1e1e]"
    }`;

  return (
    <aside className="w-60 bg-[#121212] text-sm text-gray-300 flex flex-col py-6 border-r border-black/20">
      <div className="px-4 mb-6">
        <h1 className="text-xl font-bold text-white">Player</h1>
      </div>
      <nav className="flex flex-col gap-2">
        <NavLink to="/" className={linkClass} end>
          <Home size={18} />
          Albums
        </NavLink>
        <NavLink to="/liked" className={linkClass}>
          <Heart size={18} />
          Liked Songs
        </NavLink>
         <NavLink to="/liked" className={linkClass}>
          <Settings size={18} />
          Settings 
        </NavLink>
      </nav>
    </aside>
  );
}
