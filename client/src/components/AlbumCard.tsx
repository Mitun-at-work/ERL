import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { extractMeta, type TrackMeta } from "../utils/tags";

const albumCoverCache = new Map<string, string>();

export default function AlbumCard({ name }: { name: string }) {
  const [cover, setCover] = useState("/default-cover.png");

  useEffect(() => {
    if (albumCoverCache.has(name)) {
      setCover(albumCoverCache.get(name)!);
      return;
    }

    async function loadCover() {
      try {
        const res = await fetch(`/albums/${encodeURIComponent(name)}`);
        const songs: string[] = await res.json();

        if (!songs || songs.length === 0) {
          albumCoverCache.set(name, "/default-cover.png");
          setCover("/default-cover.png");
          return;
        }

        const firstSong = songs[0];
        const meta: TrackMeta = await extractMeta(`/music/${name}/${firstSong}`);

        if (meta.cover) {
          albumCoverCache.set(name, meta.cover);
          setCover(meta.cover);
        } else {
          albumCoverCache.set(name, "/default-cover.png");
          setCover("/default-cover.png");
        }
      } catch {
        albumCoverCache.set(name, "/default-cover.png");
        setCover("/default-cover.png");
      }
    }

    loadCover();
  }, [name]);

  return (
    <Link
      to={`/album/${encodeURIComponent(name)}`}
      className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 
                 bg-gradient-to-br from-[#2a2a2a] via-[#1e1e1e] to-[#121212]"
    >
      {/* Album cover */}
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={cover}
          alt={`Cover for album ${name}`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Info section */}
      <div className="p-4">
        <h3 className="text-white font-semibold truncate text-lg group-hover:text-green-400">
          {name}
        </h3>
        <p className="text-gray-400 text-sm">Album</p>
      </div>
    </Link>
  );
}
