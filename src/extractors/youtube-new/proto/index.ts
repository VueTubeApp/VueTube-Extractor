import { Root, Type, loadSync } from 'protobufjs';
import path from 'path';
import { duration, order, type, uploadDate, commentSortOptions, FEATURE_BY_SEARCH_FEATURE } from './conversion';
import type { searchProto, protoFilters, commentOptions } from './types';
import { searchFilter } from './types';

class Proto {
  private protoRoot: Root;
  constructor() {
    this.protoRoot = loadSync(path.join(__dirname, 'youtube.proto'));
  }

  /**
   * encodes Visitor Data to protobuf format
   *
   * @param {string} id - visitor id. Should be an 11 character long random string
   * @param {number} timestamp - timestamp of initialization
   *
   * @returns {string} encoded visitor data
   */
  encodeVisitorData(id: string, timestamp: number): string {
    const visitorData: Type = this.protoRoot.lookupType('youtube.VisitorData');
    const buf: Uint8Array = visitorData.encode({ id, timestamp }).finish();
    return encodeURIComponent(Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_'));
  }

  /**
   * encodes search filter to protobuf format
   * @param {Partial<searchFilter>} filters - search filters
   * @returns {string} encoded search filter
   */
  encodeSearchFilter(filters: Partial<searchFilter>): string {
    if (filters?.uploadDate && filters?.type !== 'video') {
      throw new Error(JSON.stringify(filters) + '\n' + 'Search filter type must be video');
    }
    const data: searchProto = filters ? { filters: {} } : { noFilter: 0 };
    if (data.filters) {
      data.filters = {
        ...data.filters,
        ...(filters.uploadDate && { param_0: uploadDate[filters.uploadDate] }),
        ...(filters.type && { param_1: type[filters.type] }),
        ...(filters.duration && { param_2: duration[filters.duration] }),
      };
      if (filters.order) data.sort = order[filters.order];
      if (filters.features) {
        for (const feature of filters.features) {
          data.filters[FEATURE_BY_SEARCH_FEATURE[feature] as keyof protoFilters] = 1;
        }
      }
    }
    const searchFilter: Type = this.protoRoot.lookupType('youtube.SearchFilter');
    const buf: Uint8Array = searchFilter.encode(data).finish();
    return encodeURIComponent(Buffer.from(buf).toString('base64'));
  }

  /**
   * encodes comment options to protobuf format
   * @param {string} videoId - video id
   * @param options
   * @returns {string} encoded comment options
   */
  encodeCommentOptions(videoId: string, options: commentOptions = {}): string {
    const commentOptions: Type = this.protoRoot.lookupType('youtube.CommentsSection');
    const data = {
      ctx: { videoId },
      unkParam: 6,
      params: {
        opts: {
          videoId,
          sortBy: commentSortOptions[options.sortBy || 'topComments'],
          type: options.type || 2,
        },
        target: 'comments-section',
      },
    };
    const buf: Uint8Array = commentOptions.encode(data).finish();
    return encodeURIComponent(Buffer.from(buf).toString('base64'));
  }
}

const singletonProto = new Proto();

Object.freeze(singletonProto);

export default singletonProto;
