import videoFormat from "./videoFormat";
import audioFormat from "./audioFormat";
import videoSelection from "./gridVideo";

type video = {
  title: string;
  descriptionText: string;
  descriptionFormatted?: Array<object>;
  thumbnails: Array<{
    url: string;
    width: number;
    height: number;
  }>;
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
    tags: Array<string>;
    channel: {
      channelId: string;
      channelUrl: string;
      channelName: string;
      channelThumbnails: Array<{
        url: string;
        width: number;
        height: number;
      }>;
      subscriberCount?: number;
    };
    ratings?: {
      hasRating: boolean;
      likes: number;
      isLiked: boolean;
      isDisliked: boolean;
    };
    playbackEndpoints?: Array<videoFormat | audioFormat>;
    relatedVideos?: Array<videoSelection>;
  };
};

export default video;
