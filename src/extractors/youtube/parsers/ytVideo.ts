import video from "~/types/video";
import abstractParser from "./abstractParser";
import playerResponse from "../types/playerResponse";
const at = require("array.prototype.at");

/**
 * ```typescript
 * import parser from './parsers/ytVideo';
 * const video = new parser.ytVideo.parse(data);
 * ```
 */
class ytVideo implements abstractParser {
  /**
   * Main parse function.
   * @param data The data to parse
   * @returns {video}
   */
  public parse(data: { player: playerResponse; next: object }): video {
    // Play endpoint data
    const videoDetails = data.player.videoDetails;
    const microformat = data.player.microformat.playerMicroformatRenderer;
    const playbackTracking = data.player.playbackTracking;
    const captions = data.player.captions.playerCaptionsTracklistRenderer;
    const streamingData = data.player.streamingData;

    // Next endpoint data
    // const engagementPanels = data.next.engagementPanels;

    const response: video = {
      id: videoDetails.videoId,
      title: videoDetails.title,
      descriptionText: videoDetails.shortDescription,
      thumbnails: videoDetails.thumbnail.thumbnails,
      metadata: {
        lengthSeconds: videoDetails.lengthSeconds,
        views: videoDetails.viewCount,
        isLive: videoDetails.isLiveContent,
        isFamilyFriendly: microformat.isFamilySafe,
        isUnlisted: microformat.isUnlisted,
        isPrivate: videoDetails.isPrivate,
        category: microformat.category,
        publishedAt: microformat.publishDate,
        uploadedAt: microformat.uploadDate,
        tags: videoDetails.keywords,
        playbackEndpoints: streamingData.adaptiveFormats.concat(
          streamingData.formats
        ),
      },
    };

    return response;
  }
}
