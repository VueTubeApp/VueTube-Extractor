import Config from "./config";
import YT_CONSTANTS from "../../utils/constants";
import { YTContext } from "../../utils/types";
import Context from "./context";

export default class Initializer {
  private config: Config;
  private mWebContext: YTContext;
  private appContext: YTContext;

  async init() {
    // Request API key from YouTube's Innertube API (as well as client object)
    this.config = await new Config().getInnertubeConfig(YT_CONSTANTS.URL.YT_MOBILE);
    // Generate context(s) for future requests
    this.mWebContext = new Context("MOBILE_WEB").getContext(this.config.client);
    this.appContext = new Context("MOBILE_APP").getContext(this.config.client);
  }
}
