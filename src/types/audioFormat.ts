/**
 * Type for audio endpoints.
 */
type audioFormat = {
  itag: number;
  url: string;
  mimetype: string;
  bitrate: number;
  width: number;
  height: number;
  quality: string;
  sampleRate: number;
  audioChannels: number;
  [x: string | number | symbol]: unknown;
};

export default audioFormat;
