import abstractParser from "../abstractParser";
import { pageDivider } from "../../types";

export default class VideoContextParser extends abstractParser {
    parse(data: { [key: string]: any }): pageDivider {
        const response: pageDivider = {
            type: "divider"
        };
        return response;
    }
}
