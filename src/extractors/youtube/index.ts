import initialization from "./core/initialize";
import userConfig from "./types/userConfig";
import { YouTubeHTTPOptions } from "./utils";

export default class YouTube {
  private config: userConfig;
  private apiKey: string;
  private baseHttpOptions: YouTubeHTTPOptions;
  private ready: boolean = false;

  protected retry_count: number = 0;

  /**
   * extractor for YouTube
   * ```typescript
   * import { YouTube } from 'vuetube-extractor';
   * const yt = await new YouTube().initAsync();
   * ```
   */
  constructor(config?: userConfig) {
    this.config = config || {};
  }

  async initAsync() {
    const initial = await new initialization(this.config).initAsync();

    this.baseHttpOptions = initial.getBaseHttpOptions();
    this.ready = true;
    return this;
  }
}
