import { Root, Type, loadSync } from 'protobufjs';
import path from 'path';

import type { searchProto, protoFilters, commentOptions } from './types';
import { SearchFilter } from '../utils/types';
import {
  SEARCH_UPLOAD_DATE_OPTIONS,
  SEARCH_TYPE_OPTIONS,
  SEARCH_DURATION_OPTIONS,
  SEARCH_ORDER_OPTIONS,
  FEATURE_BY_SEARCH_FEATURE,
  COMMENT_SORT_OPTIONS,
} from '../utils/constants';

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
   * @param {Partial<SearchFilter>} filters - search filters
   * @returns {string} encoded search filter
   */
  encodeSearchFilter(filters: Partial<SearchFilter>): string {
    if (filters?.uploadDate && filters?.type !== 'video') {
      throw new Error(JSON.stringify(filters) + '\n' + 'Search filter type must be video');
    }
    const data: searchProto = filters ? { filters: {} } : { noFilter: 0 };
    if (data.filters) {
      data.filters = {
        ...data.filters,
        ...(filters.uploadDate && { param_0: SEARCH_UPLOAD_DATE_OPTIONS[filters.uploadDate] }),
        ...(filters.type && { param_1: SEARCH_TYPE_OPTIONS[filters.type] }),
        ...(filters.duration && { param_2: SEARCH_DURATION_OPTIONS[filters.duration] }),
      };
      if (filters.order) data.sort = SEARCH_ORDER_OPTIONS[filters.order];
      if (filters.features) {
        for (const feature of filters.features) {
          data.filters[FEATURE_BY_SEARCH_FEATURE[feature] as keyof protoFilters] = 1;
        }
      }
    }
    const SearchFilter: Type = this.protoRoot.lookupType('youtube.SearchFilter');
    const buf: Uint8Array = SearchFilter.encode(data).finish();
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
          sortBy: COMMENT_SORT_OPTIONS[options.sortBy || 'topComments'],
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
