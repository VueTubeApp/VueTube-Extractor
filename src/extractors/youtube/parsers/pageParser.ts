import modelParsers from "./modelParsers";
import abstractParser from "./abstractParser";
import { pageSegment } from "../types";

export default abstract class YoutubePageParsers extends abstractParser {
  protected callParsers(
    identifier: string,
    itemElement: { [key: string]: any }
  ): pageSegment | false {
    if (!modelParsers[identifier]) return false;
    const parsedElement = modelParsers[identifier].parserObj.parse(
      itemElement
    ) as pageSegment;
    return parsedElement;
  }
}
