import { thumbnail } from "@types";

export default class Thumbnail implements thumbnail {
  private data: { [key: string]: any };
  private ignoreKeys: Array<string> = [
    "isAndroid",
    "isVideoWithContext",
    "maxOverlayWidth",
  ];
  constructor(data: { [key: string]: any }) {
    this.data = data;
    Object.keys(data).forEach((key) => {
      if (this.ignoreKeys.includes(key)) {
        delete data[key];
      }
    });
    Object.assign(this, data);
  }
  get thumbnails() {
    return this.data.image.sources;
  }
}