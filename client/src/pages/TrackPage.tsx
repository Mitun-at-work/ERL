import { usePlayer } from "../context/PlayerContext";

export default function TrackPage() {
  const {
    title,
    artist,
    cover: albumArt,
    duration,
  } = usePlayer();

  const album = "Unknown Album"; // Local variable for album name

  // Format duration from seconds to mm:ss
  const formatDuration = (sec: number) => {
    if (!sec) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex items-center justify-center text-white min-h-screen mt-2  animate-gradient">
      <div className="flex items-center max-w-5xl w-full px-12">
        <img
          src={albumArt || "/default-cover.png"}
          alt={`${album} album art`}
          className="w-60 h-60 rounded-md shadow-3xl"
        />
        <div className="ml-12">
          <h1 className="text-6xl font-bold">{title || "Unknown Title"}</h1>
          <p className="text-3xl mt-3">{artist || "Unknown Artist"}</p>
          <p className="mt-6 text-gray-300">Duration: {formatDuration(duration)}</p>
        </div>
      </div>
    </div>
  );
}
