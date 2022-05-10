import { Http, HttpResponse } from "@capacitor-community/http";
import proto from "../proto";
import { YouTubeHTTPOptions, YtUtils, ytConstants, ytErrors } from "../utils";
import ytContext from "../types/ytContext";
import ytcfg from "../types/ytcfg";
import userConfig from "../types/userConfig";

export default class initialization {
  private config: userConfig;

  private innertubeKey: string;
  private ready: boolean = false;
  private context: ytContext;
  private baseHttpOptions: YouTubeHTTPOptions;

  /**
   * ```typescript
   * const initial = new initialization(config).initAsync();
   * ```
   * @param {userConfig} config
   */
  constructor(config: userConfig) {
    this.config = config;
  }

  /**
   * Must be run before any other methods. Changes readiness to true on success.
   *
   * @returns {Promise<initialization>}
   */
  async initAsync(): Promise<initialization> {
    const data = await this.getDefaultConfig();
    this.innertubeKey = data.INNERTUBE_API_KEY;

    this.context = await this.buildContext();
    this.ready = true;

    this.buildBaseHttpOptions();

    return this;
  }

  /**
   * Returns context information for the YouTube extractor.
   * @returns {ytContext}
   */
  private buildContext(): ytContext {
    const userAgent = YtUtils.randomMobileUserAgent();

    const visitorId = YtUtils.randomString(11); // 11 characters long
    const visitorData = proto.encodeVisitorData(visitorId, Date.now());

    const context: ytContext = {
      client: {
        gl: this.config.gl?.toUpperCase() || "US",
        hl: this.config.hl?.toLowerCase() || "en",
        deviceMake: userAgent.vendor,
        deviceModel: userAgent.platform,
        visitorData: visitorData,
        userAgent: userAgent.userAgent,
        clientName: ytConstants.YTAPIVAL.CLIENTNAME as "ANDROID",
        clientVersion: ytConstants.YTAPIVAL.VERSION,
        osName: "Android",
        platform: "MOBILE",
      },
      user: { lockedSafetyMode: false },
      request: { useSsl: true },
    };

    return context;
  }

  /**
   * builds and sets the base HTTP options for the YouTube extractor.
   * @returns {void}
   */
  private buildBaseHttpOptions(): void {
    if (!this.ready) return;
    this.baseHttpOptions = new YouTubeHTTPOptions({
      apiKey: this.innertubeKey,
      context: this.context,
    });
  }

  /**
   * Fetches the innertube key from the YouTube API.
   * @returns {Promise<string>}
   */
  private async getDefaultConfig(): Promise<ytcfg> {
    const response: any = await Http.get({
      url: `${ytConstants.URL.YT_MOBILE}/sw.js`,
    }).catch((err) => {
      if (typeof err === "string") {
        throw new ytErrors.InitializationError(err.toUpperCase());

      } else if (err instanceof Error) {
        throw new ytErrors.InitializationError(err.message);
      }
    });
    return JSON.parse(YtUtils.findBetween(response.data, "ytcfg.set(", ");"));
  }

  getBaseHttpOptions(): YouTubeHTTPOptions {
    return this.baseHttpOptions;
  }
}
