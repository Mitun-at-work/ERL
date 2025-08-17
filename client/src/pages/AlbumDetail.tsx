import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { TrackMeta } from "../utils/tags";

export default function AlbumDetail() {
  const { albumId } = useParams<{ albumId: string }>();
  const [tracks, setTracks] = useState<TrackMeta[]>([]);

  useEffect(() => {
    fetch(`/api/album/${albumId}`)
      .then((res) => res.json())
      .then((data) => setTracks(data.tracks));
  }, [albumId]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Album: {albumId}</h1>
      <ul className="space-y-2">
        {tracks.map((track, i) => (
          <li key={i} className="flex items-center gap-4">
            <img
              src={track.cover || "/default-cover.png"}
              alt=""
              className="w-10 h-10 rounded"
            />
            <div>
              <div className="font-medium">{track.title}</div>
              <div className="text-xs text-gray-400">
                {track.artist} — {track.genre}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
