import initialization from "./core/initializer";
import userConfig from "./types/userConfig";
import { YouTubeHTTPOptions, ytErrors } from "./utils";
import video from "./types/video";
import youtubeRequester from "./core/requester";
import Parser from "./parsers";

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
   * const yt = await new YouTube().init();
   * ```
   *
   * @param {userConfig} [config] The config parameter is optional.
   */
  constructor(config?: userConfig) {
    this.config = config || {};
  }

  /**
   * Initializes the extractor. This is required before any other method can be called.
   * @returns {Promise<YouTube>}
   */
  async init(): Promise<YouTube> {
    try {
      const initial = await new initialization(this.config).buildAsync();

      this.baseHttpOptions = initial.getBaseHttpOptions();
      this.requester = new youtubeRequester(this);
    } catch (err) {
      if (this.retry_count < (this.config.maxRetryCount || 5)) {
        this.init();
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

  /**
   *
   * Retrieves the video details for a given video id.
   *
   * @param {string} videoId video id to get the details for
   * @param {boolean} includeRecommendations whether to include recommendations or not
   * @returns {Promise<video>}
   */
  async getVideoDetails(
    videoId: string,
    includeRecommendations = false
  ): Promise<video> {
    if (!this.ready) {
      throw new ytErrors.ExtractorNotReadyError(
        "Extractor is not ready. Please call init() first."
      );
    }
    const videoInfo = await this.requester.getVideoInfo(videoId);
    const parsed = new Parser("videoDetail", { player: videoInfo.player.videoDetails, next: videoInfo.next }).parse();
    return parsed as video;
  }

  getBaseHttpOptions(): YouTubeHTTPOptions {
    return this.baseHttpOptions;
  }
}
