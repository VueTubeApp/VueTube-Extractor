import { YouTubeHTTPOptions } from "../utils";
import YouTube from "..";
import { Http, HttpResponse, HttpOptions } from "@vuetubeapp/http";
import {
  ytVideoData,
  playerResponse,
  browseConfig,
  searchFilter,
} from "../types";
import proto from "../proto";

export default class youtubeRequester {
  private session: YouTube;
  private baseHttpOptions: YouTubeHTTPOptions;
  private androidHttpOptions: YouTubeHTTPOptions;

  /**
   * the requester for all YouTube requests. Do not use directly.
   * @param session The session to use
   */
  constructor(session: YouTube) {
    this.session = session;
    this.baseHttpOptions = session.getBaseHttpOptions("web");
    this.androidHttpOptions = session.getBaseHttpOptions("android");
  }

  /**
   * retrieves a video from YouTube.
   *
   * @param {string} videoId The video id to get the details for
   * @param {boolean} includeRecommendations Whether to include recommendations or not
   *
   * @returns {Promise<ytVideoData>}
   */
  async getVideoInfo(videoId: string): Promise<ytVideoData> {
    const httpOptionsPlayer = this.baseHttpOptions.getOptions(
      { data: { videoId: videoId } },
      "/player"
    );
    const responsePlayer = await Http.post(httpOptionsPlayer);
    const responseNext = await this.getNext({ videoId: videoId });
    return { player: responsePlayer.data, next: responseNext.data };
  }

  /**
   *
   * Calls the Youtube browse endpoint.
   * This is most commonly used for getting
   * the home page.
   *
   * @param {string} id The id to call the browse endpoint with
   * @param {Record<string, unknown>} args The arguments to pass to the browse endpoint
   * @returns {Promise<HttpResponse>} The response from the browse endpoint
   */
  async browse(id: string, args: browseConfig = {}): Promise<HttpResponse> {
    const data: HttpOptions["data"] = args.data || {};
    (args.isContinuation && (data.continuation = id)) || (data.browseId = id);
    const httpOptionsNext = this.androidHttpOptions.getOptions(
      { data: data || {}, params: args.params || {} },
      `/browse`
    );
    const response = await Http.post(httpOptionsNext);
    return response.data;
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
    const httpOptionsNext = this.androidHttpOptions.getOptions(
      { data: args },
      "/next"
    );
    return Http.post(httpOptionsNext);
  }

  /**
   * Calls the Youtube search endpoint.
   * @param {string} query - The query to search for
   * @param {Partial<searchFilter>} filters - The filters to pass to the search endpoint
   */
  async search(
    query: string,
    filters: Partial<searchFilter>
  ): Promise<HttpResponse> {
    filters.features = [...new Set(filters.features)]; // enforce unique values
    const params = proto.encodeSearchFilter(filters);
    const httpOptions = this.androidHttpOptions.getOptions(
      { data: { query, params } },
      "/search"
    );
    return Http.post(httpOptions);
  }
}
