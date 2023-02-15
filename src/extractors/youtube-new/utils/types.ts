// import { imageData as ImageData, audioFormat as AudioFormat, videoFormat as VideoFormat } from "@types";

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

// export type SearchFeatures =
//   | "live"
//   | "video4k"
//   | "hd"
//   | "subtitles"
//   | "cc"
//   | "video360"
//   | "vr180"
//   | "video3d"
//   | "hdr"
//   | "location"
//   | "purchased";
// export interface SearchFilter {
//   uploadDate: "hour" | "day" | "week" | "month" | "year" | "all";
//   order: "relevance" | "viewCount" | "rating" | "uploadDate";
//   type: "video" | "playlist" | "channel" | "all";
//   duration: "short" | "medium" | "long" | "all";
//   features: Array<SearchFeatures>;
// }

// export type ParseTypes =
//   | "videoDetail"
//   | "homePage"
//   | "searchSuggestions"
//   | "searchResult";

// export type UserConfig = {
//   hl?: string;
//   gl?: string;
//   maxRetryCount?: number;
// };

export type ClientName = "ANDROID" | "IOS" | "WEB" | "MWEB";

export type YTClient = {
  gl: string;
  hl: string;
  deviceMake?: string;
  deviceModel?: string;
  userAgent: string;
  clientName: ClientName;
  clientVersion: string;
  osName: "Android" | "iOS" | "Windows" | "Macintosh" | "Linux" | "MWeb";
  osVersion?: number;
  platform: "MOBILE" | "DESKTOP";
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
