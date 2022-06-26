import basicController from "./basicController";
import type YouTube from "..";
import type {
  searchResult,
  ytPageParseResults,
  browseConfig,
  searchFilter,
} from "../types";
import type { HttpOptions } from "@vuetubeapp/http";
import Parser from "../parsers";
import proto from "../proto";
import { ytErrors } from "../utils";

export default class searchPageController extends basicController<searchResult> {
  id: string;
  filters: Partial<searchFilter>;

  constructor(
    id: string,
    filters: Partial<searchFilter> = {},
    session: YouTube,
    config: browseConfig = {}
  ) {
    super(session, config);
    this.id = id;
    this.filters = filters;
  }

  protected buildRequestOptions(): Array<{
    option: HttpOptions;
    key?: string;
  }> {
    this.filters.features = [...new Set(this.filters.features)]; // enforce unique values
    const params = proto.encodeSearchFilter(this.filters);
    const requestOptions = {
      data: {
        ...this.config.data,
        ...{params},
        ...(this.config.isContinuation
          ? { continuation: this.id }
          : { query: this.id }),
      },
      params: { ...this.config.params },
    };
    return [
      {
        option: this.androidHttpOptions.getOptions(requestOptions, "/search"),
        key: "search",
      },
    ];
  }

  protected parseRawResponse(data: {
    [key: string]: any;
  }): ytPageParseResults<searchResult> {
    return new Parser(
      "searchResult",
      data
    ).parse() as ytPageParseResults<searchResult>;
  }

  protected postProcessResponse(
    data: ytPageParseResults<searchResult>
  ): searchResult {
    const continueMethod = async (): Promise<searchResult> => {
        if (!data.Continuation?.nextContinuationData) {
            throw new ytErrors.EndOfPageError("No continuation data");
        }
        const continueController = new searchPageController(
            data.Continuation?.nextContinuationData,
            this.filters,
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
