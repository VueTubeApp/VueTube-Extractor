/**
 * Type for audio endpoints.
 */
export type audioFormat = {
  itag: number;
  url: string;
  mimetype: string;
  bitrate: number;
  width: number;
  height: number;
  quality: string;
  sampleRate: number;
  audioChannels: number;
  [x: string | number | symbol]: unknown;
};

export type caption = {
  url: string;
  name: string;
  vssId: string;
  languageCode: string;
};

/**
 * For video selection on the search page, home page, etc.
 */
export type videoSelection = {
  id: string;
  title: string;
  descriptionText: string;
  channel: {
    channelId: string;
    channelUrl: string;
    channelName: string;
    channelThumbnails: Array<{
      url: string;
      width: number;
      height: number;
    }>;
  };
  metadata: {
    views: number;
    published?: string;
    overlay?: {
      text: string;
      style: string;
    };
    thumbnails: Array<{
      url: string;
      width: number;
      height: number;
    }>;
  };
};

export type imageData = {
  url: string;
  width: number;
  height: number;
};

/**
 * Type for video endpoints.
 */
export type videoFormat = {
  itag: number;
  url: string;
  mimetype: string;
  bitrate: number;
  width: number;
  height: number;
  fps: number;
  quality: string;
  qualityLabel?: string;
  [x: string | number | symbol]: unknown;
};

interface channelData {
  channelId: string;
  channelUrl: string;
  channelName?: string;
  channelThumbnails: Array<imageData>;
  subscriberCount?: number;
}
export interface video {
  title: string;
  id: string;
  descriptionText: string;
  descriptionFormatted?: Array<object>;
  thumbnails: Array<imageData>;
  metadata: {
    lengthSeconds: number;
    views?: number;
    isLive: boolean;
    wasLive?: boolean;
    isFamilyFriendly?: boolean;
    isUnlisted?: boolean;
    isPrivate?: boolean;
    category?: string;
    publishedAt: string;
    uploadedAt: string;
    tags: Array<string>;
    channel?: channelData;
    ratings?: {
      hasRating: boolean;
      likes: number;
      isLiked: boolean;
      isDisliked: boolean;
    };
    playbackEndpoints?: Array<videoFormat | audioFormat>;
    relatedVideos?: Array<videoSelection>;
  };
}

export type pageElements = videoCard | channelCard;

export interface channelCard {
  channelId: string;
  thumbnail: Array<imageData>;
  channelName: string;
  videoCountText?: string;
  subScriberCountText?: string;
  navigationEndpoint?: {
    browseId: string;
    canonicalBaseUrl: string;
  };
  banner?: Array<imageData>;
}

export interface videoCard {
  title: string;
  details: string;
  videoId: string;
  thumbnails: Array<imageData>;
  timestamp: {
    text: string;
    style: string;
  };
  channelData: channelData;
  type: "video";
}
export interface searchSuggestion {
  query: string;
  results: Array<string>;
}

/**
 * Types for page data.
 */

/**
 * Segment of a page.
 */
export type pageSegmentTypes = "genericSegment" | "shortsShelf" | "post" | "divider" | "shelf";
export interface pageSegment {
  type: pageSegmentTypes;
  contents: Array<pageElements>;
}

export interface shelfSegment extends pageSegment {
  header?: string;
  collapseCount?: number;
  collapseText?: string;
  type: "shelf";
}

/**
 * Page types.
 */
export interface genericPage {
  segments: Array<pageSegment>;
  chips?: Array<string>;
  continue?: () => Promise<genericPage>;
}

/**
 * Type for search results
 */
export interface searchResult extends genericPage {
  correctQuery?: string;
  searchRefinements?: Array<string>;
  resultCount: number;
}
