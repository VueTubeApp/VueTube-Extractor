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
    const responseObject: { [key: string]: HttpOptions } = {};
    for (const { option, key } of options) {
      const response = await Http.post(option);
      if (response.status === 200) {
        responseObject[key || option.url] = response.data;
      }
    }
    let toReturn;
    if (Object.keys(responseObject).length === 1) {
      toReturn = responseObject[Object.keys(responseObject)[0]];
    } else if (!responseObject) {
      throw new ytErrors.ParserError("No data returned");
    } else {
      toReturn = responseObject;
    }
    this.throwErrors(toReturn);
    return toReturn;
  }

  protected abstract parseRawResponse(data: { [key: string]: any }): object;

  protected abstract postProcessResponse(data: { [key: string]: any }): V;

  protected throwErrors(data: { [key: string]: any }): void {}

  public async parseData(data: { [key: string]: any }): Promise<V> {
    const parsedData = this.parseRawResponse(data);
    const postProcessed = this.postProcessResponse(parsedData);
    return postProcessed;
  }
}
