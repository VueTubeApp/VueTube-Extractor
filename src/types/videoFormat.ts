/**
 * Type for video endpoints.
 */
type videoFormat = {
  itag: number;
  url: string;
  mimetype: string;
  bitrate: number;
  width: number;
  height: number;
  fps: number;
  quality: string;
  qualityLabel?: string;
};

export default videoFormat;
