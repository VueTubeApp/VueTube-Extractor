import abstractParser from "../abstractParser";
import { videoSegment } from "../../types";
import { ytErrors } from "../../utils";

export default class privateVideoContextParser implements abstractParser {
  parse(data: { [key: string]: any }): videoSegment {
    const {
      videoWithContextData,
      metadata,
      channelId,
      channelAvatar,
      expandableMetadata,
    } = this.getAliases(data);

    const response: videoSegment = {
      data: {
        title: metadata.title,
        details: metadata.metadataDetails,
        thumbnails: videoWithContextData.videoData.thumbnail.image.sources,
        videoId:
          videoWithContextData.onTap.innertubeCommand.watchEndpoint.videoId,
        timestamp: {
          text: videoWithContextData.videoData.timestampText,
          style: videoWithContextData.videoData.timestampStyle,
        },
        channelData: {
          channelId: channelId,
          channelUrl: `/channel/${channelId}`,
          channelThumbnails: channelAvatar.image.sources,
        },
      },
      type: "video",
    };
    return response;
  }

  private getAliases(data: { [key: string]: any }) {
    const componentType =
      data.elementRenderer.newElement.type.componentType.model;
    let videoWithContextModel;

    if (componentType.videoWithContextModel) {
      videoWithContextModel = componentType.videoWithContextModel;
    } else if (componentType.videoWithContextSlotsModel) {
      videoWithContextModel = componentType.videoWithContextSlotsModel;
    } else {
      throw new ytErrors.ParserError("No videoWithContextModel found");
    }

    const videoWithContextData = videoWithContextModel.videoWithContextData;

    const metadata = videoWithContextData.videoData.metadata;

    const channelAvatar = (
      videoWithContextData.videoData.decoratedAvatar ||
      videoWithContextData.videoData
    ).avatar;

    const channelId =
      videoWithContextData.videoData.channelId ||
      channelAvatar.endpoint?.innertubeCommand.browseEndpoint?.browseId;

    const expandableMetadata = videoWithContextModel.expandableMetadata || {};

    return {
      videoWithContextData,
      metadata,
      channelId,
      channelAvatar,
      expandableMetadata,
    };
  }
}
