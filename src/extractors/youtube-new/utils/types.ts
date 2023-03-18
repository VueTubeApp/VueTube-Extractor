// import { imageData as ImageData, audioFormat as AudioFormat, videoFormat as VideoFormat } from "@types";

import {
  CLIENT_NAME,
  DEVICE_TYPE,
  FEATURE,
  OS_NAME,
  PARSE_TYPE,
  PLATFORM,
  SEARCH_DURATION,
  SEARCH_FEATURE,
  SEARCH_ORDER,
  SEARCH_TYPE,
  SEARCH_UPLOAD_DATE,
} from './constants';

// export {
//   video as Video,
//   videoCard as VideoCard,
//   channelCard as ChannelCard,
//   playlist as Playlist,
//   pageSegment as PageSegment,
//   genericPage as GenericPage,
//   pageSegmentTypes as PageSegmentTypes,
//   pageDivider as PageDivider,
//   shelfSegment as ShelfSegment,
//   searchResult as SearchResult,
//   searchSuggestion as SearchSuggestion,
//   pageElements as PageElements,
//   thumbnail as Thumbnail,
// } from "@types";

// export interface PlayerResponse {
//   playabilityStatus: {
//     status: string;
//     playableInEmbed?: boolean;
//     reason?: string;
//     contextParams: string;
//     [x: string | number | symbol]: unknown;
//   };
//   streamingData: {
//     expiresInSeconds: number;
//     formats: Array<VideoFormat | AudioFormat>;
//     adaptiveFormats: Array<VideoFormat | AudioFormat>;
//   };
//   playbackTracking: {
//     videostatsPlaybackUrl: { baseUrl: string };
//     videostatsDelayplayUrl: { baseUrl: string };
//     videostatsWatchtimeUrl: { baseUrl: string };
//     [x: string | number | symbol]: unknown;
//   };
//   captions?: {
//     playerCaptionsTracklistRenderer: {
//       captionTracks: [
//         {
//           baseUrl: string;
//           name: object;
//           vssId: string;
//           languageCode: string;
//           isTranslatable: boolean;
//         }
//       ];
//       translationLanguages: [
//         {
//           languageCode: string;
//           languageName: object;
//         }
//       ];
//       audioTracks: Array<object>;
//       defaultAudioTrackIndex: number;
//     };
//   };
//   videoDetails: {
//     videoId: string;
//     title: string;
//     lengthSeconds: number;
//     keywords: Array<string>;
//     channelId: string;
//     isOwnerViewing: boolean;
//     shortDescription: string;
//     isCrawlable: boolean;
//     thumbnail: {
//       thumbnails: Array<ImageData>;
//     };
//     allowRatings: boolean;
//     viewCount: number;
//     author: string;
//     isPrivate: boolean;
//     isUnpluggedCorpus: boolean;
//     isLiveContent: boolean;
//     [x: string | number | symbol]: unknown;
//   };
//   microformat: {
//     playerMicroformatRenderer: {
//       lengthSeconds: number;
//       ownerProfileUrl: string;
//       externalChannelId: string;
//       isFamilySafe: boolean;
//       availableCountries: Array<string>;
//       isUnlisted: boolean;
//       viewCount: number;
//       category?: string;
//       publishDate: string;
//       ownerChannelName: string;
//       uploadDate: string;
//       liveBroadcastDetails?: {
//         isLiveNow: boolean;
//         startTimestamp: string;
//       };
//       [x: string | number | symbol]: unknown;
//     };
//   };
// }

// interface RequesterConfig {
//   data?: any;
//   params?: any;
// }

// export interface BrowseConfig extends RequesterConfig {
//   isContinuation?: boolean;
// }

export interface SearchFilter {
  uploadDate: SearchUploadDate;
  order: SearchOrder;
  type: SearchType;
  duration: SearchDuration;
  features: SearchFeatures[];
}

// export type UserConfig = {
//   hl?: string;
//   gl?: string;
//   maxRetryCount?: number;
// };

export type ParseTypes = (typeof PARSE_TYPE)[keyof typeof PARSE_TYPE];
export type ClientName = (typeof CLIENT_NAME)[keyof typeof CLIENT_NAME];
export type OsName = (typeof OS_NAME)[keyof typeof OS_NAME];
export type Platform = (typeof PLATFORM)[keyof typeof PLATFORM];
export type SearchFeatures = (typeof SEARCH_FEATURE)[keyof typeof SEARCH_FEATURE];
export type Features = (typeof FEATURE)[keyof typeof FEATURE];

export type SearchUploadDate = (typeof SEARCH_UPLOAD_DATE)[keyof typeof SEARCH_UPLOAD_DATE];
export type SearchOrder = (typeof SEARCH_ORDER)[keyof typeof SEARCH_ORDER];
export type SearchType = (typeof SEARCH_TYPE)[keyof typeof SEARCH_TYPE];
export type SearchDuration = (typeof SEARCH_DURATION)[keyof typeof SEARCH_DURATION];

export type DeviceType = (typeof DEVICE_TYPE)[keyof typeof DEVICE_TYPE];

export type Device = {
  baseURL: string;
  clientName: ClientName;
  clientVersion: string;
  clientFormFactor: string;
  osName: string;
  platform: Platform;
};

export type YTClient = {
  gl: string;
  hl: string;
  deviceMake?: string;
  deviceModel?: string;
  userAgent: string;
  clientName: ClientName;
  clientVersion: string;
  osName: OsName;
  osVersion?: number;
  platform: Platform;
  remoteHost?: string;
  clientFormFactor?: string;
  visitorData?: string;
};

export type YTContext = {
  client: YTClient;
  user: { lockedSafetyMode: boolean };
  request: { useSsl: boolean };
};

// export type HTTPMetadata = {
//   apiKey: string;
//   context: YTContext;
// };

// // -- parsers -- //

// export type YTVideoData = {
//   player: PlayerResponse;
//   next: object;
// };

// export interface Continuation {
//   nextContinuationData: string;
//   reloadContinuationData: string;
// }

// export interface YTPageParseResults<T> {
//   page: T;
//   Continuation?: Continuation;
// }
