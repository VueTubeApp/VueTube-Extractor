import videoFormat from "~/types/videoFormat";
import audioFormat from "~/types/audioFormat";
import imageData from "~/types/imageData";

interface playerResponse {
  playabilityStatus: {
    status: string;
    playableInEmbed: boolean;
    contextParams: string;
    [x: string | number | symbol]: unknown;
  };
  streamingData: {
    expiresInSeconds: number;
    formats: Array<videoFormat | audioFormat>;
    adaptiveFormats: Array<videoFormat | audioFormat>;
  };
  playBackTracking: {
    videostatsPlaybackUrl: { baseUrl: string };
    videostatsDelayplayUrl: { baseUrl: string };
    videostatsWatchtimeUrl: { baseUrl: string };
    [x: string | number | symbol]: unknown;
  };
  captions: {
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
  [x: string | number | symbol]: unknown;
}
export default playerResponse;
