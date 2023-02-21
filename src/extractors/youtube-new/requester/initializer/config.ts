import { Http, HttpResponse } from "@vuetubeapp/http";
import { YTClient } from "extractors/youtube-new/utils/types";
import YT_CONSTANTS from "../../utils/constants";
import Errors from "../../../../utils/errors";

export default class Config {
  private client_: Partial<YTClient>;
  private apiKey_: string;

  get client(): Partial<YTClient> {
    return this.client_;
  }

  get apiKey(): string {
    return this.apiKey_;
  }

  parseJSDataResponse(response: HttpResponse) {
    try {
      const rawData: Array<any> = JSON.parse(response.data.replace(")]}'", ""));
      const data = rawData[0][2];
      this.apiKey_ = data[1];
      this.client_ = {
        gl: data[0][0][1],
        hl: data[0][0][0],
        clientVersion: data[0][0][16],
        remoteHost: data[0][0][3],
        visitorData: data[6],
      };
    } catch (e) {
      throw new Errors.VueTubeExtractorError("Invalid data structure returned by YouTube API");
    }
  }

  /**
   * Fetches the innertube key from the YouTube API.
   * @returns {Promise<Config>} Class containing API key and initial client object
   */
  async getInnertubeConfig(
    baseURL: string = YT_CONSTANTS.URL.YT_MOBILE
  ): Promise<Config> {
    const response: void | HttpResponse = await Http.get({
      url: `${baseURL}/sw.js_data`,
      responseType: "text",
    }).catch((err) => {
      if (typeof err === "string") {
        throw new Errors.VueTubeExtractorError(err.toUpperCase());
      } else if (err instanceof Error) {
        throw new Errors.VueTubeExtractorError(err.message);
      }
    });
    console.log(`url: ${baseURL}/sw.js_data`, response)
    if (!response || !response.data) {
      throw new Errors.VueTubeExtractorError("No response from YouTube API");
    }
    this.parseJSDataResponse(response);
    return this;
  }
}
