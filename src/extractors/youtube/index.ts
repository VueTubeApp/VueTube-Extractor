import initialization from "./core/initializer";
import { userConfig, video } from "./types";
import { YouTubeHTTPOptions, ytErrors } from "./utils";
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
    let initError;
    for (
      this.retry_count;
      this.retry_count <= (this.config.maxRetryCount || 5);
      this.retry_count++
    ) {
      try {
        const initial = await new initialization(this.config).buildAsync();
        this.baseHttpOptions = initial.getBaseHttpOptions();
        this.requester = new youtubeRequester(this);
        this.ready = true;
        return this;
      } catch (err) {
        if (this.retry_count < (this.config.maxRetryCount || 5)) {
          this.retry_count++;
          console.warn("Failed, retrying...", this.retry_count);
          console.warn(err);
        } else {
          initError = err;
        }
      }
    }
    let errorDetails = { info: "maxRetryCount reached" };
    if (typeof initError === "string") {
      throw new ytErrors.InitializationError(
        initError.toUpperCase(),
        errorDetails,
        this.retry_count
      );
    } else if (initError instanceof ytErrors.YoutubeError) {
      if (initError.details instanceof Object) {
        errorDetails = { ...errorDetails, ...initError.details };
      }
      throw new ytErrors.InitializationError(
        initError.message,
        errorDetails,
        this.retry_count
      );
    } else {
      throw new ytErrors.InitializationError(
        "UNKNOWN",
        errorDetails,
        this.retry_count
      );
    }
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
    if (videoInfo.player.playabilityStatus.status == "ERROR") {
      throw new ytErrors.VideoNotFoundError(
        videoId,
        videoInfo.player.playabilityStatus.reason || "UNKNOWN",
        videoInfo.player
      );
    } else if (videoInfo.player.playabilityStatus.status == "UNPLAYABLE") {
      throw new ytErrors.VideoNotAvailableError(
        videoId,
        videoInfo.player.playabilityStatus.reason || "UNKNOWN",
        videoInfo.player
      );
    } else if (videoInfo.player.playabilityStatus.status == "LOGIN_REQUIRED") {
      throw new ytErrors.LoginRequiredError(
        videoInfo.player.playabilityStatus.reason || "UNKNOWN",
        videoInfo.player
      );
    }
    const parsed = new Parser("videoDetail", {
      player: videoInfo.player,
      next: videoInfo.next,
    }).parse();
    return parsed as video;
  }

  getBaseHttpOptions(): YouTubeHTTPOptions {
    return this.baseHttpOptions;
  }
}
