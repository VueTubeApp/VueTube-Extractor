import basicController from "./basicController";
import type YouTube from "..";
import type { browseConfig, video } from "../types";
import type { HttpOptions } from "@vuetubeapp/http";
import Parser from "../parsers";
import { ytErrors } from "../utils";

export default class videoPageController extends basicController<video> {
  id: string;

  constructor(id: string, session: YouTube, config: browseConfig = {}) {
    super(session, config);
    this.id = id;
  }

  protected buildRequestOptions(): Array<{
    option: HttpOptions;
    key?: string;
  }> {
    const requestOptions = {
      data: {
        ...this.config.data,
        ...{
          videoId: this.id,
        },
      },
      params: { ...this.config.params },
    };
    return [
      {
        option: this.baseHttpOptions.getOptions(requestOptions, "/player"),
        key: "player",
      },
      // {
      //   option: this.androidHttpOptions.getOptions(requestOptions, "/next"),
      //   key: "next",
      // },
    ];
  }

  protected parseRawResponse(data: { [key: string]: any }): video {
    return new Parser("videoDetail", data).parse() as video;
  }

  protected postProcessResponse(data: video): video {
    return {
      ...data,
    };
  }

  protected throwErrors(videoInfo: { [key: string]: any }): void {
    if (videoInfo.playabilityStatus.status == "ERROR") {
      throw new ytErrors.VideoNotFoundError(
        this.id,
        videoInfo.playabilityStatus.reason || "UNKNOWN",
        videoInfo
      );
    } else if (videoInfo.playabilityStatus.status == "UNPLAYABLE") {
      throw new ytErrors.VideoNotAvailableError(
        this.id,
        videoInfo.playabilityStatus.reason || "UNKNOWN",
        videoInfo
      );
    } else if (videoInfo.playabilityStatus.status == "LOGIN_REQUIRED") {
      throw new ytErrors.LoginRequiredError(
        videoInfo.playabilityStatus.reason || "UNKNOWN",
        videoInfo
      );
    }
  }
}
