import abstractParser from "../abstractParser";
import { videoCard } from "../../types";
import { ytErrors } from "../../utils";
import util from "util";

export default class privateVideoContextParser extends abstractParser {
  parse(data: { [key: string]: any }): videoCard {
    const {
      videoWithContextData,
      metadata,
      channelId,
      channelAvatar,
    } = this.getAliases(data);

    const response: videoCard = {
      title: metadata.title,
      details: metadata.metadataDetails,
      thumbnails: videoWithContextData.videoData.thumbnail.image.sources,
      videoId:
        videoWithContextData.onTap.innertubeCommand.watchEndpoint.videoId,
      timestamp: {
        text: videoWithContextData.videoData.thumbnail.timestampText,
        style: videoWithContextData.videoData.thumbnail.timestampStyle,
      },
      channelData: {
        channelId: channelId,
        channelUrl: `/channel/${channelId}`,
        channelThumbnails: channelAvatar?.image.sources,
      },
      type: "video"
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
      channelAvatar?.endpoint?.innertubeCommand.browseEndpoint?.browseId;

    if (!channelAvatar) {
      console.log("uhhh no channel avatar");
      console.log(util.inspect(videoWithContextData, false, null, true));
    }

    return {
      videoWithContextData,
      metadata,
      channelId,
      channelAvatar,
    };
  }
}
