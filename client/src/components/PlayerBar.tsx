import { useMemo, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Heart,
} from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

export default function PlayerBar() {
  const {
    isPlaying,
    play,
    pause,
    next,
    prev,
    currentTime,
    duration,
    seek,
    volume,
    setVolume,
    muted,
    setMuted,
    title,
    artist,
    cover,
    shuffle,
    setShuffle,
    repeat,
    setRepeat,
  } = usePlayer();

  const [liked, setLiked] = useState(false);

  const progress = useMemo(
    () => (duration ? (currentTime / duration) * 100 : 0),
    [currentTime, duration]
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#181818] text-white border-t border-black/20">
      <div className="w-full px-6 py-3 flex items-center justify-between gap-6">
        {/* Left: Album info */}
        <div className="flex items-center gap-3 w-1/4 min-w-[180px]">
          <img
            src={cover || "/default-cover.png"}
            className="w-12 h-12 rounded object-cover"
            alt=""
          />
          <div className="min-w-0">
            <div className="truncate text-sm">{title || "—"}</div>
            <div className="truncate text-xs text-gray-400">{artist || "—"}</div>
          </div>
        </div>

        {/* Center: Controls + seek */}
        <div className="flex flex-col items-center flex-1 max-w-3xl">
          <div className="flex items-center gap-4 mb-1 relative">
            <button
              onClick={() => setShuffle(!shuffle)}
              className={
                shuffle ? "text-green-500" : "text-gray-400 hover:text-white"
              }
            >
              <Shuffle size={18} />
            </button>

            <button onClick={prev} className="p-2 hover:text-green-500">
              <SkipBack size={18} />
            </button>

            {isPlaying ? (
              <button
                onClick={pause}
                className="p-3 rounded-full bg-green-500 text-white hover:scale-105 transition"
              >
                <Pause size={18} />
              </button>
            ) : (
              <button
                onClick={play}
                className="p-3 rounded-full bg-green-500 text-white hover:scale-105 transition"
              >
                <Play size={18} />
              </button>
            )}

            <button onClick={next} className="p-2 hover:text-green-500">
              <SkipForward size={18} />
            </button>

            <button
              onClick={() => {
                if (repeat === "off") setRepeat("all");
                else if (repeat === "all") setRepeat("one");
                else setRepeat("off");
              }}
              className={
                repeat === "off"
                  ? "text-gray-400 hover:text-green relative"
                  : "text-green-500 relative"
              }
            >
              <Repeat size={18} />
              {repeat === "one" && (
                <span className="absolute text-[10px] font-bold top-0 right-0 text-green-500">
                  1
                </span>
              )}
            </button>

            {/* Like button after repeat */}
            <button
              onClick={() => setLiked(!liked)}
              className={liked ? "text-green-500" : "text-gray-400 hover:text-green-500"}
            >
              <Heart size={18} fill={liked ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="w-full flex items-center gap-2 text-xs text-gray-400">
            <span>{fmt(currentTime)}</span>
            <input
              className="slim flex-1"
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              style={{ "--seek-progress": `${progress}%` } as React.CSSProperties}
            />
            <span>{fmt(duration)}</span>
          </div>
        </div>

        {/* Right: Volume only */}
        <div className="flex items-center justify-end gap-3 w-1/4 min-w-[150px]">
          <button
            onClick={() => setMuted(!muted)}
            className="p-2 hover:text-green-500"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            className="slim w-28"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => {
              const v = Number(e.target.value);
              setVolume(v);
              if (v > 0 && muted) setMuted(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}

function fmt(s?: number) {
  if (!s || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}
