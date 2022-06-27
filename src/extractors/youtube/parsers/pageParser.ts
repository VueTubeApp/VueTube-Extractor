import modelParsers from "./modelParsers";
import abstractParser from "./abstractParser";
import type { pageElements } from "../types";
import { applyMixins } from "../utils";
import sectionMixin from "./mixins/section";

const ytPageParserBase = applyMixins(abstractParser, sectionMixin);
export default abstract class YoutubePageParsers extends ytPageParserBase {
  protected _callParsers(
    identifier: string,
    itemElement: unknown
  ): pageElements | false {
    const parser = modelParsers(identifier);
    if (!parser) return false;
    const parsedElement = parser.parse(itemElement) as pageElements;
    return parsedElement;
  }
}
