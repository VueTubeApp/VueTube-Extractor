import { imageData, audioFormat, videoFormat } from "~/types";

export { video as video } from "~/types";

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

export type userConfig = {
  hl?: string;
  gl?: string;
  maxRetryCount?: number;
};

export type ytcfg = {
  EXPERIMENT_FLAGS: Record<string, unknown>;
  INNERTUBE_API_KEY: string;
  INNERTUBE_API_VERSION: string;
  INNERTUBE_CLIENT_NAME: string;
  INNERTUBE_CLIENT_VERSION: string;
  INNERTUBE_CONTEXT: Record<string, unknown>;
  INNERTUBE_CONTEXT_CLIENT_NAME: number;
  INNERTUBE_CONTEXT_CLIENT_VERSION: number;
  LATEST_ECATCHER_SERVICE_TRACKING_PARAMS: Record<string, unknown>;
};

export type ytClient = {
  gl: string;
  hl: string;
  deviceMake?: string;
  deviceModel?: string;
  userAgent: string;
  clientName: "ANDROID" | "IOS" | 1 | 2;
  clientVersion: string;
  osName: "Android" | "iOS" | "Windows" | "MacOS" | "Linux" | "MWeb";
  osVersion?: number;
  platform: "MOBILE" | "DESKTOP";
  remoteHost?: string;
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
