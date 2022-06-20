import abstractParser from "../abstractParser";
import { pageDivider } from "../../types";
import { YtUtils } from "../../utils";

export default class privateVideoContextParser extends abstractParser {
    parse(data: { [key: string]: any }): pageDivider {
        const response: pageDivider = {
            type: "divider"
        };
        return response;
    }
}
