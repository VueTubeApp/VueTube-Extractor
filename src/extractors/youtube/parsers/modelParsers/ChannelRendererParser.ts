import abstractParser from "../abstractParser";
import {channelCard} from "@types";
import {YtUtils} from "../../utils";

export default class VideoContextParser extends abstractParser {
    parse(data: { [key: string]: any }): channelCard {
        data = data.compactChannelRenderer
        return {
            channelId: data.channelId,
            channelName: YtUtils.getStringFromRuns(data.displayName?.runs),
            videoCountText: YtUtils.getStringFromRuns(data.videoCountText?.runs),
            thumbnail: data.thumbnail?.thumbnails,
            banner: data.tvBanner?.thumbnails,
            navigationEndpoint: {
                browseId: data.navigationEndpoint?.browseEndpoint?.browseId,
                canonicalBaseUrl: data.navigationEndpoint?.browseEndpoint?.canonicalBaseUrl,
            },
            subscriberCountText: YtUtils.getStringFromRuns(data.subscriberCountText.runs),
            type: "channel"
        };
    }
}
