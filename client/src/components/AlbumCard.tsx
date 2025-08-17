import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { extractMeta } from "../utils/tags";  

export default function AlbumCard({ name }: { name: string }) {
  const [cover, setCover] = useState("/default-cover.png");

  useEffect(() => {
    fetch(`/albums/${encodeURIComponent(name)}`)
      .then(r => r.json())
      .then((songs: string[]) => {
        if (songs.length > 0) {
          extractMeta(`/music/${name}/${songs[0]}`).then(meta => {
            if (meta.cover) setCover(meta.cover);
          });
        }
      });
  }, [name]);

  return (
    <Link
      to={`/album/${encodeURIComponent(name)}`}
      className="bg-elevated rounded-lg p-4 hover:bg-hover transition group"
    >
      <img
        src={cover}
        alt={name}
        className="w-full h-40 object-cover rounded-md mb-3 group-hover:scale-105 transition-transform"
      />
      <h3 className="text-fg font-semibold truncate">{name}</h3>
      <p className="text-muted text-sm">Album</p>
    </Link>
  );
}
