import { useEffect, useState } from "react";

export default function Liked() {
  const [songs, setSongs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/tracks/favorites")
      .then((r) => r.json())
      .then(setSongs);
  }, []);

  return (
    <div className="p-6 text-white bg-[#121212] min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Liked Songs</h1>
      {songs.length === 0 ? (
        <p className="text-gray-400">No liked songs yet.</p>
      ) : (
        <ul className="space-y-2">
          {songs.map((s) => (
            <li
              key={s.file}
              className="p-2 flex items-center gap-3 bg-[#1e1e1e] rounded"
            >
              <img
                src={s.cover || "/default-cover.png"}
                alt=""
                className="w-12 h-12 rounded object-cover"
              />
              <div>
                <div className="text-sm font-medium">{s.title || s.file}</div>
                <div className="text-xs text-gray-400">{s.artist || "Unknown"}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
