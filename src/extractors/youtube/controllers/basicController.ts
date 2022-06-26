import type YouTube from "..";
import type { browseConfig } from "../types";
import { YouTubeHTTPOptions } from "../utils";
import type { HttpOptions } from "@vuetubeapp/http";
import { Http } from "@vuetubeapp/http";
import { ytErrors } from "../utils";

export default abstract class basicController<V extends object = object> {
  protected config: browseConfig;
  protected session: YouTube;
  protected baseHttpOptions: YouTubeHTTPOptions;
  protected androidHttpOptions: YouTubeHTTPOptions;

  constructor(session: YouTube, config: browseConfig = {}) {
    this.config = config;
    this.session = session;
    this.baseHttpOptions = session.getBaseHttpOptions("web");
    this.androidHttpOptions = session.getBaseHttpOptions("android");
  }

  protected abstract buildRequestOptions(): Array<{
    option: HttpOptions;
    key?: string;
  }>;

  public async getRequest(): Promise<
    HttpOptions | { [key: string]: HttpOptions }
  > {
    const options = this.buildRequestOptions();
    let toReturn: { [key: string]: HttpOptions } = {};
    for (const { option, key } of options) {
      const response = await Http.post(option);
      if (response.status === 200) {
        toReturn[key || option.url] = response.data;
      }
    }
    if (Object.keys(toReturn).length === 1) {
      return toReturn[Object.keys(toReturn)[0]];
    } else if (!toReturn) {
      throw new ytErrors.ParserError("No data returned");
    } 
    else {
      return toReturn;
    }
  }

  protected abstract parseRawResponse(data: { [key: string]: any }): object;

  protected abstract postProcessResponse(data: { [key: string]: any }): V;

  public async parseData(data: { [key: string]: any }): Promise<V> {
    let parsedData = this.parseRawResponse(data);
    const postProcessed = this.postProcessResponse(parsedData);
    return postProcessed;
  }
}