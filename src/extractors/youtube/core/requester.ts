import { YouTubeHTTPOptions } from "../utils";
import YouTube from "..";
import video from "../types/video";
import { Http } from "@capacitor-community/http";
import { ytConstants } from "../utils";

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
   * @returns {Promise<video>}
   */
  async getVideoInfo(
    videoId: string,
    includeRecommendations: boolean
  ): Promise<video> {
    const httpOptionsPlayer = this.baseHttpOptions.getOptions(
      { data: { videoId: videoId } },
      "/player"
    );
    const responsePlayer = await Http.get(httpOptionsPlayer);
  }

  /**
   * Calls Youtube's next endpoint. This is mostly used for pagination, however it can also be used to get page data
   *
   *
   *
   */
}
