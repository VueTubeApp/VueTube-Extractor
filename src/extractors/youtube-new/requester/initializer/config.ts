import { Http, HttpResponse } from "@vuetubeapp/http";
import { ClientName, YTClient } from "extractors/youtube-new/utils/types";
import YT_CONSTANTS from "../../utils/constants";
import Errors from "../../../../utils/errors";
// import { YouTubeHTTPOptions, ytErrors, YtUtils } from "../../utils";

export default class Config {
  private client_: Partial<YTClient>;
  private apiKey_: string;

  get client(): Partial<YTClient> {
    return this.client_;
  }

  get apiKey(): string {
    return this.apiKey_;
  }

  parseResponse(response: HttpResponse) {
    const rawData: Array<any> = JSON.parse(response.data.replace(")]}'", ""));
    const data = rawData[0][2];
    this.apiKey_ = data[1];
    this.client_ = {
      gl: data[0][0][1],
      hl: data[0][0][0],
      clientVersion: data[0][0][16],
      clientName: YT_CONSTANTS.YTAPIVAL.CLIENT_WEB_Mobile as ClientName,
      remoteHost: data[0][0][3],
      visitorData: data[6],
    };
  }

  /**
   * Fetches the innertube key from the YouTube API.
   * @returns {Promise<Config>} Class containing API key and initial client object
   */
  async getDefaultConfig(): Promise<Config> {
    const response: void | HttpResponse = await Http.get({
      url: `${YT_CONSTANTS.URL.YT_MOBILE}/sw.js_data`,
      responseType: "text",
    }).catch((err) => {
      if (typeof err === "string") {
        throw new Errors.VueTubeExtractorError(err.toUpperCase());
      } else if (err instanceof Error) {
        throw new Errors.VueTubeExtractorError(err.message);
      }
    });
    if (!response || !response.data) {
      throw new Errors.VueTubeExtractorError("No response from YouTube API");
    }
    this.parseResponse(response);
    return this;
  }
}
