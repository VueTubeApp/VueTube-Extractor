import modelParsers from "./modelParsers";
import abstractParser from "./abstractParser";
import { pageElements } from "../types";

export default abstract class YoutubePageParsers extends abstractParser {
  protected callParsers(
    identifier: string,
    itemElement: { [key: string]: any }
  ): pageElements | false {
    if (!modelParsers[identifier]) return false;
    const parsedElement = modelParsers[identifier].parse(
      itemElement
    ) as pageElements;
    return parsedElement;
  }
}
