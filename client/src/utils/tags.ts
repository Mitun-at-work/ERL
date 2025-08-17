// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const jsmediatags: any;

export interface TrackMeta {
  title: string;
  artist: string;
  album: string;
  year: string;
  track: string;
  genre: string;
  cover: string | null;
}

export function extractMeta(fileUrl: string): Promise<TrackMeta> {
  return new Promise((resolve) => {
    fetch(fileUrl)
      .then((r) => r.blob())
      .then((blob) => {
        jsmediatags.read(blob, {
          onSuccess: (tag: any) => {
            // Print all available tags for debugging
            console.log("Full metadata:", tag.tags);

            const { title, artist, album, year, track, genre, picture } =
              tag.tags;
            let cover: string | null = null;

            if (picture) {
              let binary = "";
              const bytes = new Uint8Array(picture.data);
              for (let i = 0; i < bytes.length; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              cover = `data:${picture.format};base64,${btoa(binary)}`;
            }

            resolve({
              title: title || fileUrl.split("/").pop() || "Unknown",
              artist: artist || "Unknown Artist",
              album: album || "Unknown Album",
              year: year || "",
              track: track || "",
              genre: genre || "",
              cover,
            });
          },
          onError: (error: any) => {
            console.warn("Metadata read error:", error);
            resolve({
              title: fileUrl.split("/").pop() || "Unknown",
              artist: "Unknown Artist",
              album: "Unknown Album",
              year: "",
              track: "",
              genre: "",
              cover: null,
            });
          },
        });
      })
      .catch((err) => {
        console.error("File fetch error:", err);
        resolve({
          title: fileUrl.split("/").pop() || "Unknown",
          artist: "Unknown Artist",
          album: "Unknown Album",
          year: "",
          track: "",
          genre: "",
          cover: null,
        });
      });
  });
}


