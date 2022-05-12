import initialization from "./core/initializer";
import userConfig from "./types/userConfig";
import { YouTubeHTTPOptions, ytErrors } from "./utils";
import video from "./types/video";
import youtubeRequester from "./core/requester";

export default class YouTube {
  private config: userConfig;
  private baseHttpOptions: YouTubeHTTPOptions;
  private requester: youtubeRequester;
  private ready = false;

  protected retry_count = 0;

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
      const initial = await new initialization(this.config).buildAsync();

      this.baseHttpOptions = initial.getBaseHttpOptions();
      this.requester = new youtubeRequester(this);
    } catch (err) {
      if (this.retry_count < (this.config.maxRetryCount || 5)) {
        this.initAsync();
      } else {
        let errorDetails = { info: "maxRetryCount reached" };
        if (typeof err === "string") {
          throw new ytErrors.InitializationError(
            err.toUpperCase(),
            errorDetails,
            this.retry_count
          );
        } else if (err instanceof ytErrors.YoutubeError) {
          if (err.details instanceof Object) {
            errorDetails = { ...errorDetails, ...err.details };
          }
          throw new ytErrors.InitializationError(
            err.message,
            errorDetails,
            this.retry_count
          );
        }
      }
    }
    this.ready = true;
    return this;
  }

  async getVideoDetails(
    videoId: string,
    includeRecommendations: boolean = false
  ): Promise<video> {
    if (!this.ready) {
      throw new ytErrors.ExtractorNotReadyError(
        "Extractor is not ready. Please call initAsync() first."
      );
    }
    const videoInfo = await this.requester.getVideoInfo(
      videoId,
      includeRecommendations
    );
    // return videoInfo;
  }

  getBaseHttpOptions(): YouTubeHTTPOptions {
    return this.baseHttpOptions;
  }
}
