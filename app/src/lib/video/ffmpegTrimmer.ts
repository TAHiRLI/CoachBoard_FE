import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

// Single-threaded core: no SharedArrayBuffer / COOP-COEP headers required.
// @ffmpeg/ffmpeg runs the core inside a module Worker that `import()`s this
// URL, so it must be the ESM build — the UMD build isn't a valid ES module
// and fails silently with "failed to import ffmpeg-core.js".
const FFMPEG_CORE_VERSION = "0.12.6";
const CORE_BASE_URL = `https://unpkg.com/@ffmpeg/core@${FFMPEG_CORE_VERSION}/dist/esm`;

let ffmpegPromise: Promise<FFmpeg> | null = null;

/**
 * Kicks off the ffmpeg.wasm core download/init ahead of time (e.g. as soon as
 * the clip editor opens or a local file is picked) so that cold-load latency
 * overlaps with the user setting trim points instead of stacking on top of
 * the trim + upload time when they submit.
 */
export const preloadFFmpeg = () => {
  void getFFmpeg().catch(() => {
    // Swallow here — trimVideoFile will surface the real error on submit.
  });
};

const getFFmpeg = async () => {
  if (!ffmpegPromise) {
    ffmpegPromise = (async () => {
      const ffmpeg = new FFmpeg();
      await ffmpeg.load({
        coreURL: await toBlobURL(`${CORE_BASE_URL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${CORE_BASE_URL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      return ffmpeg;
    })().catch((err) => {
      ffmpegPromise = null;
      throw err;
    });
  }
  return ffmpegPromise;
};

/**
 * Cuts [startSeconds, endSeconds) out of a local video file entirely in the browser
 * so only the trimmed segment ever needs to be uploaded, not the whole source file.
 */
export const trimVideoFile = async (
  file: File,
  startSeconds: number,
  endSeconds: number,
  onProgress?: (ratio: number) => void,
): Promise<Blob> => {
  const ffmpeg = await getFFmpeg();
  const duration = Math.max(0.1, endSeconds - startSeconds);
  const extension = file.name.split(".").pop() || "mp4";
  const inputName = `input.${extension}`;
  const outputName = "output.mp4";

  const handleProgress = ({ progress }: { progress: number }) => {
    onProgress?.(Math.min(1, Math.max(0, progress)));
  };
  ffmpeg.on("progress", handleProgress);

  try {
    await ffmpeg.writeFile(inputName, await fetchFile(file));
    // -ss before -i seeks at the input level, so ffmpeg only decodes/encodes the
    // requested segment instead of the entire source video.
    await ffmpeg.exec([
      "-ss", startSeconds.toString(),
      "-i", inputName,
      "-t", duration.toString(),
      "-c:v", "libx264",
      "-preset", "ultrafast",
      "-c:a", "aac",
      outputName,
    ]);
    const data = await ffmpeg.readFile(outputName);
    return new Blob([data as Uint8Array], { type: "video/mp4" });
  } finally {
    ffmpeg.off("progress", handleProgress);
    await ffmpeg.deleteFile(inputName).catch(() => {});
    await ffmpeg.deleteFile(outputName).catch(() => {});
  }
};
