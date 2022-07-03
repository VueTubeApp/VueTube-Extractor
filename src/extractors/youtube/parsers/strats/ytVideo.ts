import abstractParser from "../abstractParser";
import { playerResponse, video } from "../../types";
import { ytErrors } from "../../utils";
/**
 * ```typescript
 * import {ytVideo} from './parsers';
 * const video = new ytVideo.parse(data);
 * ```
 */
export default class ytVideo extends abstractParser {
  /**
   * Main parse function.
   * @param data The data to parse
   * @returns {video}
   */
  parse(data: playerResponse): video {
    this.checkValidity(data);
    // Play endpoint data
    const videoDetails = data.videoDetails;
    const microformat = data.microformat.playerMicroformatRenderer;
    // const playbackTracking = data.player.playbackTracking;
    // const captions = data.player.captions?.playerCaptionsTracklistRenderer;
    const streamingData = data.streamingData;

    // Next endpoint data
    // const engagementPanels = data.next.engagementPanels;

    const response: video = {
      id: videoDetails.videoId,
      title: videoDetails.title,
      descriptionText: videoDetails.shortDescription,
      thumbnails: videoDetails.thumbnail.thumbnails,
      metadata: {
        lengthSeconds: Number(videoDetails.lengthSeconds),
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

  private checkValidity(data: playerResponse): void {
    if (Object.keys(data).length === 0) {
      throw new ytErrors.ParserError("No player data found", {
        received: data,
      });
    }
  }
}
