import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Album from "./pages/Album";
import PlayerBar from "./components/PlayerBar";
import SettingsPage from "./pages/Settings";

export default function App() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/album/:name" element={<Album />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
      <PlayerBar />
    </div>
  );
}
