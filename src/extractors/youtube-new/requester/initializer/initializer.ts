import { YT_CONSTANTS, DEVICE_TYPE } from 'extractors/youtube-new/utils/constants';
import { YTContext } from 'extractors/youtube-new/utils/types';
import Config from './config';
import Context from './context';

export class Initializer {
  private _mWebContext: YTContext;
  private _appContext: YTContext;

  async init(): Promise<void> {
    // Request API key from YouTube's Innertube API (as well as client object)
    const { client } = await new Config().getInnertubeConfig(YT_CONSTANTS.URL.YT_MOBILE);

    // Generate context(s) for future requests
    this._mWebContext = new Context(DEVICE_TYPE.MOBILE_WEB).getContext(client);
    this._appContext = new Context(DEVICE_TYPE.MOBILE_APP).getContext(client);
  }

  get mWebContext(): YTContext {
    return this._mWebContext;
  }

  get appContext(): YTContext {
    return this._appContext;
  }
}
