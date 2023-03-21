import { HttpOptions } from '@vuetubeapp/http';
import { BaseControllerModel, GenericPage } from './base.controller.model';

export class HomePageController implements BaseControllerModel<GenericPage> {
  getRequest(): Promise<HttpOptions | Record<string, HttpOptions>> {
    throw new Error('Method not implemented.');
  }
  buildRequestOptions(): { option: HttpOptions; key?: string | undefined }[] {
    throw new Error('Method not implemented.');
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
