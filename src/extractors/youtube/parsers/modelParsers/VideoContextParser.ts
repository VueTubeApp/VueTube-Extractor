import abstractParser from "../abstractParser";
import PlaylistParser from "./PlaylistParser";
import Thumbnail from "./Thumbnail";
import { videoCard, playlist } from "../../types";
import { ytErrors } from "../../utils";

export default class VideoContextParser extends abstractParser {
  private data: {[key: string]: any}
  private contextData: { [key: string]: any };
  private metadata: { [key: string]: any };
  private channelId: string;
  private channelAvatar: { [key: string]: any };
  
  parse(data: { [key: string]: any }): videoCard | playlist {
    this.data = data
    this.getAliases();
    if (this.isPlaylist()) {
      return this.parsePlaylist();
    } else {
      return this.parseVideo();
    }
  }

  private parseVideo(): videoCard {
    return {
      title: this.metadata.title,
      details: this.metadata.metadataDetails,
      thumbnails: new Thumbnail(this.contextData.videoData.thumbnail),
      videoId: this.contextData.onTap.innertubeCommand.watchEndpoint.videoId,
      channelData: {
        channelId: this.channelId,
        channelUrl: `/channel/${this.channelId}`,
        channelThumbnails: this.channelAvatar?.image.sources,
      },
      type: "video",
    };
  }

  private parsePlaylist(): playlist {
    return new PlaylistParser().parse(this.data);
  }

  private isPlaylist(): boolean {
    return this.metadata?.isPlaylistMix ? true : false;
  }

  private getAliases() {
    const componentType =
      this.data.elementRenderer.newElement.type.componentType.model;
    let videoWithContextModel;

    if (componentType.videoWithContextModel) {
      videoWithContextModel = componentType.videoWithContextModel;
    } else if (componentType.videoWithContextSlotsModel) {
      videoWithContextModel = componentType.videoWithContextSlotsModel;
    } else {
      throw new ytErrors.ParserError("No videoWithContextModel found");
    }

    this.contextData = videoWithContextModel.videoWithContextData;

    this.metadata = this.contextData.videoData.metadata;

    this.channelAvatar = (
      this.contextData.videoData.decoratedAvatar || this.contextData.videoData
    ).avatar;

    this.channelId =
      this.contextData.videoData.channelId ||
      this.channelAvatar?.endpoint?.innertubeCommand.browseEndpoint?.browseId;
  }
}
