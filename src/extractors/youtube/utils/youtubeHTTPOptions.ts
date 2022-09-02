import { HttpOptions } from "@vuetubeapp/http";
import { httpMetadata } from "../types";
import { ytConstants } from ".";
import path from "path";

/**
 * Constructs an HTTP object with the correct headers and base data for YouTube.
 */

export default class YouTubeHTTPOptions {
  private readonly baseOptions: HttpOptions;
  private metadata: httpMetadata;

  constructor(metadata: httpMetadata) {
    this.metadata = metadata;
    this.baseOptions = this.setBaseOptions();
  }

  /**
   * Returns a base HTTP options object with the correct headers and base data for YouTube. Should be called before any other methods.
   * @returns {HttpOptions}
   */
  private setBaseOptions(): HttpOptions {
    const base: HttpOptions = {
      url: ytConstants.URL.YT_BASE_API,
    };
    base.headers = {};
    base.headers[
      "accept-language"
    ] = `${this.metadata.context.client.gl.toLowerCase()}-${this.metadata.context.client.hl.toUpperCase()}`;

    base.headers["x-goog-visitor-id"] =
      this.metadata.context.client.visitorData || "";

    base.headers["x-youtube-client-version"] =
      this.metadata.context.client.clientVersion;

    base.headers["user-agent"] = this.metadata.context.client.userAgent;

    base.data = {};
    base.data.context = this.metadata.context;

    base.params = { ...{ key: this.metadata.apiKey }, ...base.params };

    return base;
  }

  /**
   * Returns an HttpOptions object by merging the base options with the given options.
   * Joining the base options with the given options is done by overwriting the base options
   * except for sub arrays and objects, which is combined when possible.
   *
   * @param {Partial<HttpOptions>} options - the options to merge with the base options
   * @param {string} url - the endpoint url
   *
   * @returns {HttpOptions}
   */
  public getOptions(options: Partial<HttpOptions>, url: string): HttpOptions {
    const mergedOptions: HttpOptions = { ...this.baseOptions };
    mergedOptions.data = { ...mergedOptions.data, ...options.data };
    mergedOptions.headers = { ...mergedOptions.headers, ...options.headers };
    const urlTest = new RegExp("^(?:[a-z]+:)?//", "i");
    if (urlTest.test(url)) {
      mergedOptions.url = url;
    } else {
      const originalUrl = new URL(mergedOptions.url);
      mergedOptions.url = new URL(
        path.join(originalUrl.pathname, url),
        originalUrl
      ).href.toString();
    }

    return mergedOptions;
  }
}
