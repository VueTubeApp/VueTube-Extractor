import basicController from "./basicController";
import type YouTube from "..";
import type { genericPage, ytPageParseResults, browseConfig } from "../types";
import type { HttpOptions } from "@vuetubeapp/http";
import Parser from "../parsers";
import { ytErrors } from "../utils";

export default class homePageController extends basicController<genericPage> {
  id: string;

  constructor(
    id = "FEwhat_to_watch",
    session: YouTube,
    config: browseConfig = {}
  ) {
    super(session, config);
    this.id = id;
  }

  protected buildRequestOptions(): Array<{
    option: HttpOptions;
    key?: string;
  }> {
    const requestOptions = {
      data: {
        ...this.config.data,
        ...(this.config.isContinuation
          ? { continuation: this.id }
          : { browse_id: this.id }),
      },
      params: { ...this.config.params },
    };
    return [
      {
        option: this.androidHttpOptions.getOptions(requestOptions, "/browse"),
        key: "browse",
      },
    ];
  }

  protected parseRawResponse(data: {
    [key: string]: any;
  }): ytPageParseResults<genericPage> {
    return new Parser(
      "homePage",
      data
    ).parse() as ytPageParseResults<genericPage>;
  }

  protected postProcessResponse(
    data: ytPageParseResults<genericPage>
  ): genericPage {
    const continueMethod = async (): Promise<genericPage> => {
      if (!data.Continuation?.nextContinuationData) {
        throw new ytErrors.EndOfPageError("No continuation data");
      }
      const continueController = new homePageController(
        data.Continuation?.nextContinuationData,
        this.session,
        { ...this.config, ...{ isContinuation: true } }
      );
      const requestedData = await continueController.getRequest();
      return continueController.parseData(requestedData);
    };
    return {
      ...data.page,
      continue: continueMethod,
    };
  }
}
