import modelParsers from "./modelParsers";
import abstractParser from "./abstractParser";
import type { pageElements } from "../types";
import { applyMixins } from "../utils";
import sectionMixin from "./mixins/section";

const ytPageParserBase = applyMixins(abstractParser, sectionMixin);
export default abstract class YoutubePageParsers extends ytPageParserBase {
  protected _callParsers(
    identifier: string,
    itemElement: unknown,
  ): pageElements | false {
    if (!modelParsers[identifier]) return false;
    const parsedElement = modelParsers[identifier].parse(
      itemElement
    ) as pageElements;
    return parsedElement;
  }
}
