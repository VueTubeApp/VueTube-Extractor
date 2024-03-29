import abstractParser from "../abstractParser";
import {pageDivider} from "@types";

export default class VideoContextParser extends abstractParser {
    parse(data: { [key: string]: any }): pageDivider {
        return {
            type: "divider"
        };
    }
}
