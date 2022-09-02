import { YouTubeHTTPOptions } from "../utils";
import YouTube from "..";
import { Http, HttpResponse, HttpOptions } from "@vuetubeapp/http";
import { ytVideoData, browseConfig, searchFilter } from "../types";
import proto from "../proto";
import constants from "../utils/constants";

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
    return { player: responsePlayer.data, next: responseNext };
  }

  /**
   *
   * Calls the YouTube browse endpoint.
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
   * Calls YouTube's next endpoint. This is mostly used for pagination, however it can also be used to get page data
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
    const response = await Http.post(httpOptionsNext);
    return response.data;
  }

  /**
   * Calls the YouTube search endpoint.
   * @param {string} query - The query to search for
   * @param options
   * @param continuation
   *
   * @returns {Promise<HttpResponse>} The response from the search endpoint
   */
  async search(
    query: string,
    options: { filters: Partial<searchFilter>; isContinuation: boolean },
    continuation?: string
  ): Promise<HttpResponse["data"]> {
    options.filters.features = [...new Set(options.filters.features)]; // enforce unique values
    const params = proto.encodeSearchFilter(options.filters);
    const data: HttpOptions["data"] = { params };
    (options.isContinuation && (data.continuation = continuation)) ||
      (data.query = query);
    const httpOptions = this.androidHttpOptions.getOptions({ data }, "/search");
    const response = await Http.post(httpOptions);
    return response.data;
  }

  /**
   * Gets YouTube suggestions for a query
   * @param {string} query - The query to get suggestions for
   * @returns {Promise<HttpResponse>} The response from the suggestions endpoint
   */
  async getSuggestions(query: string) {
    const params = this.baseHttpOptions.getOptions({}, "/search");
    const hl = params.data.context.client.hl;
    const gl = params.data.context.client.gl;
    const response = await Http.get({
      url: constants.URL.YT_SUGGESTION_API,
      params: {
        q: query,
        ds: "yt",
        client: "youtube",
        xssi: "t",
        oe: "utf8",
        gl: gl,
        hl: hl,
      },
      responseType: "text",
    });
    return response.data;
  }
}
