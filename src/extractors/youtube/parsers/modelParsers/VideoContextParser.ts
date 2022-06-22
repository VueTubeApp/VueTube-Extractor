import abstractParser from "../abstractParser";
import Thumbnail from "./Thumbnail";
import { videoCard, playlist } from "../../types";
import { ytErrors, applyMixins } from "../../utils";

export default class VideoContextParser extends abstractParser {
  protected data: { [key: string]: any };
  protected contextData: { [key: string]: any };
  protected metadata: { [key: string]: any };
  protected channelId: string;
  protected channelAvatar: { [key: string]: any };
  protected innertubeCommand: {[key: string]: any};

  parse(data: { [key: string]: any }): videoCard | playlist {
    this.data = data;
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

  protected getAliases() {
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

    this.innertubeCommand = this.contextData.onTap.innertubeCommand;
  }
}
class PlaylistParser extends VideoContextParser {
  parse(data: { [key: string]: any }): playlist {
    this.data = data;
    this.getAliases();
    return {
      title: this.metadata.title,
      byline: this.metadata.byline,
      details: this.metadata.metadataDetails,
      playlistId:
        this.innertubeCommand?.browseEndpoint?.browseId?.slice(2) ||
        this.innertubeCommand?.watchEndpoint?.playlistId,
      videoId: this.innertubeCommand?.watchEndpoint?.videoId || undefined,
      thumbnails: new Thumbnail(this.contextData.videoData.thumbnail),
      type: "playlist",
    };
  }
}