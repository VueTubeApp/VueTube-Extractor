import { Http, HttpResponse } from "@vuetubeapp/http";
import proto from "../proto";
import { YouTubeHTTPOptions, YtUtils, ytConstants, ytErrors } from "../utils";
import { ytContext, userConfig, clientName } from "../types";

export default class initialization {
  private config: userConfig;

  private innertubeKey: string;
  private context: ytContext;
  private baseHttpOptions: YouTubeHTTPOptions;
  private INNERTUBE_CONTEXT: object;

  /**
   * ```typescript
   * const initial = new initialization(config).buildAsync();
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
  async buildAsync(): Promise<initialization> {
    let data: Array<any> = await this.getDefaultConfig();
    data = data[0][2];
    this.innertubeKey = data[1];
    this.INNERTUBE_CONTEXT = {
      client: {
        gl: this.config.gl || data[0][0][1],
        hl: this.config.hl || data[0][0][0],
        clientVersion: data[0][0][16],
        clientName: ytConstants.YTAPIVAL.CLIENT_WEB_Mobile as clientName,
        remoteHost: data[0][0][3],
      },
    };

    this.context = await this.buildContext();

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
      ...{
        client: {
          gl: "US",
          hl: "en",
          deviceMake: userAgent.vendor,
          deviceModel: userAgent.platform,
          visitorData: visitorData,
          userAgent: userAgent.userAgent,
          clientName: ytConstants.YTAPIVAL.CLIENT_WEB_Mobile as clientName,
          clientVersion: ytConstants.YTAPIVAL.VERSION_WEB,
          osName: "Android",
          platform: "MOBILE",
        },
        user: { lockedSafetyMode: false },
        request: { useSsl: true },
      },
      ...this.INNERTUBE_CONTEXT,
    };

    return context;
  }

  /**
   * builds and sets the base HTTP options for the YouTube extractor.
   * @returns {void}
   */
  private buildBaseHttpOptions(): void {
    this.baseHttpOptions = new YouTubeHTTPOptions({
      apiKey: this.innertubeKey,
      context: this.context,
    });
  }

  /**
   * Fetches the innertube key from the YouTube API.
   * @returns {Promise<string>}
   */
  private async getDefaultConfig(): Promise<Array<any>> {
    const response: void | HttpResponse = await Http.get({
      url: `${ytConstants.URL.YT_MOBILE}/sw.js_data`,
      responseType: "text",
    }).catch((err) => {
      if (typeof err === "string") {
        throw new ytErrors.InitializationError(err.toUpperCase());
      } else if (err instanceof Error) {
        throw new ytErrors.InitializationError(err.message);
      }
    });
    if (!response || !response.data) {
      throw new ytErrors.InitializationError("No response from YouTube API");
    }
    return JSON.parse(response.data.replace(")]}'", ""));
  }

  getBaseHttpOptions(): YouTubeHTTPOptions {
    return this.baseHttpOptions;
  }
}
