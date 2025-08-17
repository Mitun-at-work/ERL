import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [albums, setAlbums] = useState<string[]>([]);

  useEffect(() => {
    fetch("/albums")
      .then((r) => r.json())
      .then(setAlbums)
      .catch(() => setAlbums([]));
  }, []);

  return (
    <div className="p-8 text-white bg-[#121212] min-h-screen space-y-6">
      <h1 className="text-4xl font-bold">Albums</h1>

      {albums.length === 0 ? (
        <p className="text-gray-400">No albums found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {albums.map((album) => (
            <Link
              key={album}
              to={`/album/${encodeURIComponent(album)}`}
              className="group bg-[#1e1e1e] rounded-xl overflow-hidden shadow hover:shadow-lg transition hover:bg-[#2a2a2a]"
            >
              {/* Album cover with fallback */}
              <div className="aspect-square w-full relative">
                <img
                  src={`/albums/${encodeURIComponent(album)}/cover.jpg`}
                  alt={album}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fallback = document.createElement("div");
                    fallback.className =
                      "absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-600/30 to-blue-600/30 text-gray-400 group-hover:text-white text-2xl font-semibold";
                    fallback.innerText = album[0].toUpperCase();
                    e.currentTarget.parentNode?.appendChild(fallback);
                  }}
                />
              </div>

              <div className="p-4">
                <h2 className="text-lg font-bold truncate group-hover:text-green-500">
                  {album}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
