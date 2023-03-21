import { pageSegment } from '@types';
import { HttpOptions } from '@vuetubeapp/http';

export interface BaseControllerModel<T> {
  getRequest(): Promise<HttpOptions | Record<string, HttpOptions>>;
  buildRequestOptions(): RequestOptions[];
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
