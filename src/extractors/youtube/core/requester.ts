import { YouTubeHTTPOptions } from "../utils";
import YouTube from "..";
import video from "../types/video";
import { Http, HttpResponse } from "@capacitor-community/http";
import { ytConstants } from "../utils";
import playerResponse from "../types/playerResponse";

export default class youtubeRequester {
  private session: YouTube;
  private baseHttpOptions: YouTubeHTTPOptions;

  /**
   * the requester for all YouTube requests. Do not use directly.
   * @param session The session to use
   */
  constructor(session: YouTube) {
    this.session = session;
    this.baseHttpOptions = session.getBaseHttpOptions();
  }

  /**
   * retrieves a video from YouTube.
   *
   * @param {string} videoId The video id to get the details for
   * @param {boolean} includeRecommendations Whether to include recommendations or not
   *
   * @returns {Promise<{ player: HttpResponse["data"]; next: HttpResponse["data"] }>}
   */
  async getVideoInfo(
    videoId: string
  ): Promise<{ player: playerResponse; next: HttpResponse["data"] }> {
    const httpOptionsPlayer = this.baseHttpOptions.getOptions(
      { data: { videoId: videoId } },
      "/player"
    );
    const responsePlayer = await Http.post(httpOptionsPlayer);
    const responseNext = await this.getNext({ videoId: videoId });
    return { player: responsePlayer.data, next: responseNext.data };
  }

  /**
   * Calls Youtube's next endpoint. This is mostly used for pagination, however it can also be used to get page data
   *
   * @param {Record<string, unknown>} args The arguments to pass to the next endpoint
   *
   * @returns {Promise<HttpResponse>} The response from the next endpoint
   *
   */
  async getNext(args: Record<string, unknown>): Promise<HttpResponse> {
    const httpOptionsNext = this.baseHttpOptions.getOptions(args, "/next");
    return Http.post(httpOptionsNext);
  }
}
