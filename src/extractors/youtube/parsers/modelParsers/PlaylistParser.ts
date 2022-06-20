import abstractParser from "../abstractParser";
import Thumbnail from "./Thumbnail";
import { playlist } from "../../types";
import { ytErrors } from "../../utils";

export default class PlaylistParser extends abstractParser {
  parse(data: { [key: string]: any }): playlist {
    const { videoWithContextData, metadata, innertubeCommand } =
      this.getAliases(data);
        return {
          title: metadata.title,
          byline: metadata.byline,
          details: metadata.metadataDetails,
          playlistId:
            innertubeCommand?.browseEndpoint?.browseId?.slice(2) ||
            innertubeCommand?.watchEndpoint?.playlistId,
          videoId: innertubeCommand?.watchEndpoint.videoId || undefined,
          thumbnails: new Thumbnail(videoWithContextData.videoData.thumbnail),
          type: "playlist",
        };

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

    const innertubeCommand = videoWithContextData.onTap.innertubeCommand;

    return {
      videoWithContextData,
      metadata,
      innertubeCommand,
    };
  }
}