import initialization from "./core/initializer";
import {
  userConfig,
  video,
  genericPage,
  searchSuggestion,
  searchResult,
} from "./types";
import { YouTubeHTTPOptions, ytErrors } from "./utils";
import youtubeRequester from "./core/requester";
import Parser from "./parsers";
import homePageController from "./controllers/homePageController";
import searchPageController from "./controllers/searchController";

export default class YouTube {
  private config: userConfig;
  private baseData: initialization;
  private requester: youtubeRequester;
  private ready = false;

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
    let retry_count = 0;
    while (retry_count <= (this.config.maxRetryCount || 5)) {
      try {
        this.baseData = await new initialization(this.config).buildAsync();
        this.requester = new youtubeRequester(this);
        this.ready = true;
        return this;
      } catch (err) {
        retry_count++;
        console.warn("Failed, retrying...", retry_count);
        console.warn(err);
        initError = err;
      }
    }
    let errorDetails = { info: "maxRetryCount reached" };
    let errorMsg = "UNKNOWN";
    if (initError instanceof Error) {
      errorMsg = initError.message;
      if (
        initError instanceof ytErrors.YoutubeError &&
        initError.details instanceof Object
      ) {
        errorDetails = { ...errorDetails, ...initError.details };
      }
    }
    throw new ytErrors.InitializationError(errorMsg, errorDetails, retry_count);
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
    includeRecommendations = true
  ): Promise<video> {
    this.checkReady();
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

  /**
   * Retrieves home page data.
   * @returns {Promise<genericPage>}
   */
  async getHomePage(): Promise<genericPage> {
    this.checkReady();
    const homeController = new homePageController(undefined, this, {isContinuation: false});
    const homePage = await homeController.getRequest();
    return homeController.parseData(homePage);
  }

  /**
   * Searches youtube for a given query.
   *
   * @param {string} query - The query to search for.
   * @param {object} filters - The filters to apply to the search.
   * @returns {Promise<searchResult>}
   */
  async getSearchPage(
    query: string,
    filters: object = []
  ): Promise<searchResult> {
    this.checkReady();
    const searchController = new searchPageController(query, filters, this, {isContinuation: false});
    const searchPage = await searchController.getRequest();
    return searchController.parseData(searchPage);
  }

  /**
   * Gets search suggestions for a given query.
   * @param {string} query - The query to search for.
   * @returns {Promise<{query: string, results:Array<string>}>}
   */
  async getSearchSuggestions(query: string): Promise<searchSuggestion> {
    this.checkReady();
    const searchResponse = await this.requester.getSuggestions(query);
    const parsed = new Parser(
      "searchSuggestions",
      JSON.parse(searchResponse.replace(")]}'", ""))
    ).parse() as searchSuggestion;
    return parsed;
  }

  private checkReady() {
    if (!this.ready) {
      throw new ytErrors.ExtractorNotReadyError(
        "Extractor is not ready. Please call init() first."
      );
    }
  }

  getBaseHttpOptions(optionType?: "android" | "web"): YouTubeHTTPOptions {
    return this.baseData.getBaseHttpOptions(optionType);
  }
}
