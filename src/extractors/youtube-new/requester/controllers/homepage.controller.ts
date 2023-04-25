import { HttpOptions } from '@vuetubeapp/http';
import { BaseControllerModel, GenericPage, RequestOptions, endpoints, retrieveEndpoint } from './base.controller.model';
import { Config } from '../initializer/config';
import { Context } from '../initializer/context';

export class HomePageController implements BaseControllerModel<GenericPage> {
  getRequest(): Promise<HttpOptions | Record<string, HttpOptions>> {
    throw new Error('Method not implemented.');
  }

  buildRequestOptions(config: Config): RequestOptions {
    const context = new Context('MOBILE_APP').getContext(config.client);
    const requestOptions: RequestOptions = {
      option: {
        url: retrieveEndpoint(endpoints.browse),
        data: {
          ...context,
        },
        params: { continuation_id: config.apiKey },
      },
    };
    return requestOptions;
  }

  parseRawResponse(data: Record<string, any>): object {
    throw new Error('Method not implemented.');
  }
  postProcessResponse(data: Record<string, any>): GenericPage {
    throw new Error('Method not implemented.');
  }
  parseData(data: Record<string, any>): Promise<GenericPage> {
    throw new Error('Method not implemented.');
  }
  throwErrors(data: Record<string, any>): void {
    throw new Error('Method not implemented.');
  }
}
