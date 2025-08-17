import { createContext, useContext, useState } from "react";

type SettingsCtx = {
  musicBase: string;
  setMusicBase: (p: string) => void;
};

const Ctx = createContext<SettingsCtx | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [musicBase, setMusicBase] = useState("/music"); // default

  return (
    <Ctx.Provider value={{ musicBase, setMusicBase }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
