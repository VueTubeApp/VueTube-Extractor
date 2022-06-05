import abstractParser from "../abstractParser";
import { videoSegment } from "../../types";
import { ytErrors } from "../../utils";

export default class privateVideoContextParser implements abstractParser {
  parse(data: { [key: string]: any }): videoSegment {
    const videoWithContextModel =
      data.elementRenderer.newElement.type.componentType.model
        .videoWithContextModel.videoWithContextData;
    const metadata = videoWithContextModel.videoData.metadata;

    const channelAvatar = (
      videoWithContextModel.videoData.decoratedAvatar ||
      videoWithContextModel.videoData
    ).avatar;

    const channelId =
      videoWithContextModel.videoData.channelId ||
      channelAvatar.endpoint?.innertubeCommand.browseEndpoint?.browseId;

    const response: videoSegment = {
      data: {
        title: metadata.title,
        details: metadata.metadataDetails,
        thumbnails: videoWithContextModel.videoData.thumbnail.image.sources,
        videoId:
          videoWithContextModel.onTap.innertubeCommand.watchEndpoint.videoId,
        timestamp: {
          text: videoWithContextModel.videoData.timestampText,
          style: videoWithContextModel.videoData.timestampStyle,
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
}
