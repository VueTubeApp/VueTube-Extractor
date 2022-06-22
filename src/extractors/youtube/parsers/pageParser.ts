import modelParsers from "./modelParsers";
import abstractParser from "./abstractParser";
import { pageElements } from "../types";
import { applyMixins } from "../utils";
import sectionMixin from "./mixins/Section";

const ytPageParserBase = applyMixins(abstractParser, sectionMixin);
export default abstract class YoutubePageParsers extends ytPageParserBase {
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
