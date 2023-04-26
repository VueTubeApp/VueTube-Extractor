import { Http, HttpOptions } from '@vuetubeapp/http';
import { BaseControllerModel, GenericPage, RequestOptions, endpoints, retrieveEndpoint } from './base.controller.model';
import { Config } from '../initializer/config';
import { Context } from '../initializer/context';
import { utilityErrors, ErrorMessages } from '@utils';

export class HomePageController implements BaseControllerModel<GenericPage> {
  //TODO - move to base controller
  getRequest(config: Config, continuation?: string): Promise<HttpOptions | Record<string, HttpOptions>> {
    const requestOptions = this.buildRequestOptions(config, continuation);
    return Http.post(requestOptions.option);
  }

  buildRequestOptions(config: Config, continuation?: string): RequestOptions {
    const context = new Context('MOBILE_APP').getContext(config.client);
    const requestOptions: RequestOptions = {
      option: {
        url: retrieveEndpoint(endpoints.browse),
        data: {
          // Include the context in the data payload.
          ...context,
          // The continuation token is only included in the data payload if it is truthy.
          ...(continuation && { continuation }),
        },
        params: { key: config.apiKey },
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
