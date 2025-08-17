import { useEffect, useState } from "react";
import AlbumCard from "../components/AlbumCard"; // adjust path if needed

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
            <AlbumCard key={album} name={album} />
          ))}
        </div>
      )}
    </div>
  );
}
