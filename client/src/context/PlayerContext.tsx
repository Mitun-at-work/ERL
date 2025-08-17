import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { type TrackMeta } from "../utils/tags";
import { useSettings } from "./SettingsContext";

type RepeatMode = "off" | "one" | "all";

type PlayerCtx = {
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  currentTime: number;
  duration: number;
  seek: (t: number) => void;
  volume: number;
  setVolume: (v: number) => void;
  muted: boolean;
  setMuted: (m: boolean) => void;
  setQueue: (
    album: string,
    tracks: (TrackMeta & { file: string })[],
    startIndex?: number
  ) => void;
  title?: string;
  artist?: string;
  cover?: string;
  shuffle: boolean;
  setShuffle: (s: boolean) => void;
  repeat: RepeatMode;
  setRepeat: (r: RepeatMode) => void;
};

const Ctx = createContext<PlayerCtx | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const audio = audioRef.current;
  const { musicBase } = useSettings();

  const [album, setAlbum] = useState<string>();
  const [tracks, setTracks] = useState<(TrackMeta & { file: string })[]>([]);
  const [index, setIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, _setVolume] = useState(1);
  const [muted, _setMuted] = useState(false);

  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("off");

  const currentTrack = tracks[index];

  const play = useCallback(() => {
    audio.play().catch(() => {});
  }, [audio]);

  const pause = useCallback(() => {
    audio.pause();
  }, [audio]);

  const seek = (t: number) => {
    audio.currentTime = Math.max(0, Math.min(duration, t));
  };

  const setVolume = (v: number) => _setVolume(v);
  const setMuted = (m: boolean) => _setMuted(m);

  const setQueue = (
    alb: string,
    tr: (TrackMeta & { file: string })[],
    startIndex = 0
  ) => {
    setAlbum(alb);
    setTracks(tr);
    setIndex(startIndex);
  };

  const next = useCallback(() => {
    if (!tracks.length) return;

    if (repeat === "one") {
      audio.currentTime = 0;
      play();
      return;
    }

    if (shuffle) {
      const rand = Math.floor(Math.random() * tracks.length);
      setIndex(rand);
      setTimeout(play, 0);
      return;
    }

    if (index + 1 < tracks.length) {
      setIndex(index + 1);
      setTimeout(play, 0);
    } else {
      if (repeat === "all") {
        setIndex(0);
        setTimeout(play, 0);
      } else {
        pause();
      }
    }
  }, [tracks, index, shuffle, repeat, audio, play, pause]);

  const prev = useCallback(() => {
    if (!tracks.length) return;

    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    if (shuffle) {
      const rand = Math.floor(Math.random() * tracks.length);
      setIndex(rand);
      setTimeout(play, 0);
      return;
    }

    setIndex((i) => (i - 1 >= 0 ? i - 1 : tracks.length - 1));
    setTimeout(play, 0);
  }, [tracks, shuffle, audio, play]);

  // audio events
  useEffect(() => {
    const a = audio;
    const onTime = () => setCurrentTime(a.currentTime || 0);
    const onDur = () => setDuration(isFinite(a.duration) ? a.duration : 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    a.addEventListener("timeupdate", onTime);
    a.addEventListener("durationchange", onDur);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", next);

    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("durationchange", onDur);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", next);
    };
  }, [audio, next]);

  useEffect(() => {
    audio.muted = muted;
  }, [audio, muted]);

  useEffect(() => {
    audio.volume = volume;
  }, [audio, volume]);

  // load new track on index change
  useEffect(() => {
    if (album && currentTrack) {
      const url = `${musicBase}/${encodeURIComponent(album)}/${encodeURIComponent(currentTrack.file)}`;
      audio.src = url;
      play();

      // increment play count in DB by calling your updated backend /listen
      fetch("/listen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ track: `${encodeURIComponent(album)}/${currentTrack.file}` }),
      }).catch(() => {
        // silently ignore errors
      });
    }
  }, [album, currentTrack, audio, play, musicBase]);

  const value = useMemo<PlayerCtx>(
    () => ({
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
      setQueue,
      title: currentTrack?.title,
      artist: currentTrack?.artist,
      cover: currentTrack?.cover,
      shuffle,
      setShuffle,
      repeat,
      setRepeat,
    }),
    [
      isPlaying,
      play,
      pause,
      next,
      prev,
      currentTime,
      duration,
      volume,
      muted,
      currentTrack,
      shuffle,
      repeat,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePlayer() {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePlayer must be used inside PlayerProvider");
  return c;
}
