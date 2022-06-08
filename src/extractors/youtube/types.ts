import { imageData, audioFormat, videoFormat } from "~/types";

export {
  video,
  videoCard,
  pageSegment,
  videoSegment,
  genericPage,
  pageSegmentTypes,
  searchResult,
  searchSuggestion,
} from "~/types";

export interface playerResponse {
  playabilityStatus: {
    status: string;
    playableInEmbed?: boolean;
    reason?: string;
    contextParams: string;
    [x: string | number | symbol]: unknown;
  };
  streamingData: {
    expiresInSeconds: number;
    formats: Array<videoFormat | audioFormat>;
    adaptiveFormats: Array<videoFormat | audioFormat>;
  };
  playbackTracking: {
    videostatsPlaybackUrl: { baseUrl: string };
    videostatsDelayplayUrl: { baseUrl: string };
    videostatsWatchtimeUrl: { baseUrl: string };
    [x: string | number | symbol]: unknown;
  };
  captions?: {
    playerCaptionsTracklistRenderer: {
      captionTracks: [
        {
          baseUrl: string;
          name: object;
          vssId: string;
          languageCode: string;
          isTranslatable: boolean;
        }
      ];
      translationLanguages: [
        {
          languageCode: string;
          languageName: object;
        }
      ];
      audioTracks: Array<object>;
      defaultAudioTrackIndex: number;
    };
  };
  videoDetails: {
    videoId: string;
    title: string;
    lengthSeconds: number;
    keywords: Array<string>;
    channelId: string;
    isOwnerViewing: boolean;
    shortDescription: string;
    isCrawlable: boolean;
    thumbnail: {
      thumbnails: Array<imageData>;
    };
    allowRatings: boolean;
    viewCount: number;
    author: string;
    isPrivate: boolean;
    isUnpluggedCorpus: boolean;
    isLiveContent: boolean;
    [x: string | number | symbol]: unknown;
  };
  microformat: {
    playerMicroformatRenderer: {
      lengthSeconds: number;
      ownerProfileUrl: string;
      externalChannelId: string;
      isFamilySafe: boolean;
      availableCountries: Array<string>;
      isUnlisted: boolean;
      viewCount: number;
      category?: string;
      publishDate: string;
      ownerChannelName: string;
      uploadDate: string;
      liveBroadcastDetails?: {
        isLiveNow: boolean;
        startTimestamp: string;
      };
      [x: string | number | symbol]: unknown;
    };
  };
}

interface requesterConfig {
  data?: any;
  params?: any;
}

export interface browseConfig extends requesterConfig {
  isContinuation?: boolean;
}

export type searchFeatures =
  | "live"
  | "video4k"
  | "hd"
  | "subtitles"
  | "cc"
  | "video360"
  | "vr180"
  | "video3d"
  | "hdr"
  | "location"
  | "purchased";
export interface searchFilter {
  uploadDate: "hour" | "day" | "week" | "month" | "year" | "all";
  order: "relevance" | "viewCount" | "rating" | "uploadDate";
  type: "video" | "playlist" | "channel" | "all";
  duration: "short" | "medium" | "long" | "all";
  features: Array<searchFeatures>;
}

export type parseTypes = "videoDetail" | "homePage" | "searchSuggestions";

export type userConfig = {
  hl?: string;
  gl?: string;
  maxRetryCount?: number;
};

export type clientName = "ANDROID" | "IOS" | "WEB" | "MWEB";

export type ytClient = {
  gl: string;
  hl: string;
  deviceMake?: string;
  deviceModel?: string;
  userAgent: string;
  clientName: clientName;
  clientVersion: string;
  osName: "Android" | "iOS" | "Windows" | "MacOS" | "Linux" | "MWeb";
  osVersion?: number;
  platform: "MOBILE" | "DESKTOP";
  remoteHost?: string;
  clientFormFactor?: string;
  visitorData?: string;
};

export type ytContext = {
  client: ytClient;
  user: { lockedSafetyMode: boolean };
  request: { useSsl: boolean };
};

export type httpMetadata = {
  apiKey: string;
  context: ytContext;
};

// -- parsers -- //

export type ytVideoData = {
  player: playerResponse;
  next: object;
};
