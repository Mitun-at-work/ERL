import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import { PlayerProvider } from "./context/PlayerContext";
import { SettingsProvider } from "./context/SettingsContext";

import Album from "./pages/Album";
import Home from "./pages/Home";
import Liked from "./pages/Liked";
import Sidebar from "./components/Sidebar.tsx";
import PlayerBar from "./components/PlayerBar";

import { Menu } from "lucide-react";
import "./index.css";
import TrackPage from "./pages/TrackPage.tsx";


function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#121212] text-white pb-24">
      {sidebarOpen && <Sidebar />}
      <main className="flex-1 overflow-y-auto relative">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 left-4 z-10 p-2 bg-[#1e1e1e] rounded-md hover:bg-[#2a2a2a]"
        >
          <Menu size={20} />
        </button>
        <div className="pt-12 px-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <PlayerProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/album/:name" element={<Album />} />
              <Route path="/liked" element={<Liked />} />
              <Route path="/track" element={<TrackPage />} />
            </Route>
          </Routes>
          <PlayerBar />
        </BrowserRouter>
      </PlayerProvider>
    </SettingsProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
