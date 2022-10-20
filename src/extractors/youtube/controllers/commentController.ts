import basicController from "./basicController";
import type YouTube from "..";
import type { genericPage, browseConfig } from "../types";
import { ytErrors } from "../utils";
import type { HttpOptions } from "@vuetubeapp/http";
import type { commentOptions } from "../proto/types";
import proto from "../proto";



export default class commentController extends basicController<genericPage> {
    id: string;
    sortBy: commentOptions;


    constructor(
        id: string,
        sortBy: commentOptions,
        session: YouTube,
        config: browseConfig = {}
    ) {
        super(session, config);
        this.id = id;
        this.sortBy = sortBy;
    }

    protected buildRequestOptions(): Array<{
        option: HttpOptions;
        key?: string;
    }> {
        if (!this.id) {
            throw new ytErrors.ParserError("No id provided");
        }
        let continuation_id
        if (this.config.isContinuation) {
            continuation_id = this.id;
        }
        else {
            continuation_id = proto.encodeCommentOptions(this.id, this.sortBy);
        }
        const requestOptions = {
            data: {
                ...this.config.data,
                ...{ continuation: this.id },
            },
            params: { continuation_id },
        };
        return [
            {
                option: this.androidHttpOptions.getOptions(requestOptions, "/next"),
                key: "next",
            },
        ];
    }

    protected parseRawResponse(data: { [key: string]: any; }): object {
        return data; // TODO: parse comment data
    }

    protected postProcessResponse(data: { [key: string]: any; }): genericPage {
        return data as unknown as genericPage; // TODO: complete this
    }



}