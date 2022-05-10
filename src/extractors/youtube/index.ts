import initialization from "./core/initialize";
import userConfig from "./types/userConfig";
import { YouTubeHTTPOptions, ytErrors } from "./utils";

export default class YouTube {
  private config: userConfig;
  private baseHttpOptions: YouTubeHTTPOptions;
  private ready: boolean = false;

  protected retry_count: number = 0;

  /**
   * extractor for YouTube
   * ```typescript
   * import { YouTube } from 'vuetube-extractor';
   * const yt = await new YouTube().initAsync();
   * ```
   * 
   * @param {userConfig} [config] The config parameter is optional.
   */
  constructor(config?: userConfig) {
    this.config = config || {};
  }

  async initAsync() {
    try {
      const initial = await new initialization(this.config).initAsync();

      this.baseHttpOptions = initial.getBaseHttpOptions();
    } catch (err) {
      if (this.retry_count < (this.config.maxRetryCount || 5)) {
        this.initAsync();
      }
      else {
        let errorDetails = { info: "maxRetryCount reached" };
        if (typeof err === "string") {
          throw new ytErrors.InitializationError(err.toUpperCase(), errorDetails, this.retry_count);
        }
        else if (err instanceof ytErrors.YoutubeError) {
          if (err.details instanceof Object) {
            errorDetails = { ...errorDetails, ...err.details };
          }
          throw new ytErrors.InitializationError(err.message, errorDetails, this.retry_count);
        }
      }
    }
    this.ready = true;
    return this;
  }
}
