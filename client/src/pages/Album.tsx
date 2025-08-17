import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { useSettings } from "../context/SettingsContext";
import { extractMeta, type TrackMeta } from "../utils/tags";

type TrackWithExtras = TrackMeta & { file: string; playCount: number };

function getRandomGradient() {
  const colors = [
    "#FF6B6B",
    "#6BCB77",
    "#4D96FF",
    "#FFC75F",
    "#845EC2",
    "#00C9A7",
    "#FF9671",
    "#B39CD0",
    "#0081CF",
    "#FF5E78",
    "#FFD93D",
    "#9B5DE5",
    "#00BBF9",
    "#F15BB5",
    "#00F5D4",
    "#C1FBA4",
    "#FFABAB",
    "#F9F871",
    "#A3C9A8",
    "#50586C",
  ];

  const pick = () => colors[Math.floor(Math.random() * colors.length)];

  const patterns = [
    () => `linear-gradient(to bottom,${pick()}, #2a2a2a, #121212)`,
    () => `linear-gradient(to bottom right, ${pick()}, #2a2a2a, #121212)`,
    () => `linear-gradient(to bottom left, ${pick()}, #2a2a2a, #121212)`,
  ];
  
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  return pattern();
}

export default function Album() {
  const { name } = useParams<{ name: string }>();
  const [tracks, setTracks] = useState<TrackWithExtras[]>([]);
  const { setQueue, title } = usePlayer();
  const { musicBase } = useSettings();
  const [gradient, setGradient] = useState<string>("");

  useEffect(() => {
    if (!name) return;
    setGradient(getRandomGradient());

    fetch(`/albums/${encodeURIComponent(name)}`)
      .then(r => r.json())
      .then((songs: string[]) =>
        Promise.all(
          songs.map(async (song) => {
            const url = `${musicBase}/${name}/${song}`;
            const meta = await extractMeta(url);
            return { ...meta, file: song, playCount: 100 }; 
          })
        ).then(setTracks)
      );
  }, [name, musicBase]);

  return (
    <div className="p-6 pt-0 bg-[#121212] text-white min-h-screen">
      {/* Unified section with random gradient */}
      <div className="rounded-lg p-6 m-5" style={{ background: gradient }}>
        {/* Album header */}
        <div className="flex gap-6 mb-8">
          <img
            src={tracks[0]?.cover || "/default-cover.png"}
            alt={name}
            className="w-56 h-56 object-cover shadow-lg rounded-md"
          />
          <div className="flex flex-col justify-end">
            <span className="uppercase text-sm text-gray-200 font-semibold">
              Album
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mt-2 mb-4">{name}</h1>
            <p className="text-sm text-gray-200">
              {tracks.length} songs · {tracks[0]?.artist}
            </p>
          </div>
        </div>

        {/* Song table */}
        <table className="w-full text-left text-sm text-white">
          <thead className="border-b border-gray-700 text-gray-200 uppercase text-xs">
            <tr>
              <th className="py-2 w-8">#</th>
              <th className="py-2">Title</th>
              <th className="py-2">Artist</th>
              <th className="py-2">Listen Count</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track, i) => {
              const isPlaying = title && track.title === title;
              return (
                <tr
                  key={track.file}
                  className="group cursor-pointer transition hover:bg-black/30"
                  onClick={() => name && setQueue(name, tracks, i)}
                >
                <td className="pl-2 pr-4 text-gray-200 group-hover:text-green-400 w-8">
                  <span className="group-hover:hidden">{i + 1}</span>
                  <Play className="hidden group-hover:inline w-4 h-4" />
                </td>
                <td
                  className={`py-5 pr-15 font-medium mr-4 ${
                    isPlaying ? "text-green-400" : ""
                  }`}
                >
                {track.title}
                </td>
                  <td className="py-3 pr-4 text-gray-200">{track.artist}</td>
                  <td className="py-3 pr-4 text-gray-200">{track.playCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
