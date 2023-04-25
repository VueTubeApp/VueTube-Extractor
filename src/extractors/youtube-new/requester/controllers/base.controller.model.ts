import { pageSegment } from '@types';
import { HttpOptions } from '@vuetubeapp/http';
import { Config } from '../initializer/config';

export interface BaseControllerModel<T> {
  getRequest(): Promise<HttpOptions | Record<string, HttpOptions>>;
  buildRequestOptions(config: Config): RequestOptions;
  parseRawResponse(data: Record<string, any>): object;
  postProcessResponse(data: Record<string, any>): T;
  parseData(data: Record<string, any>): Promise<T>;
  throwErrors(data: Record<string, any>): void;
}

export interface RequestOptions {
  option: HttpOptions;
  key?: string;
}

export interface GenericPage {
  /**
   * TODO: update and move to `types.ts`
   */
  segments: pageSegment[];
  chips?: string[];
  continue?: () => Promise<GenericPage>;
}

// list all valid endpoints
export enum endpoints {
  browse = '/browse',
  search = '/search',
  player = '/player',
  next = '/next',
  qoe = 'stats/qoe',
}

// function to select the url to use for the request. Endpoints follow the same pattern: https://www.youtube.com/youtubei/v1/[endpoint]
export function retrieveEndpoint(endpoint: endpoints): string {
  return `https://www.youtube.com/youtubei/v1${endpoint}`;
}
