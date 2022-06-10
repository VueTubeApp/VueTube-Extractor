import {
  ytVideo,
  abstractParser,
  homePage,
  searchSuggestions,
  searchPage,
} from "./strats";
import { ytErrors } from "../utils";
import { ytVideoData, parseTypes } from "../types";

export default class Parser {
  private toParse: parseTypes;
  private data: ytVideoData | object;

  constructor(toParse: parseTypes, data: object) {
    this.toParse = toParse;
    this.data = data;
  }

  parse(): object {
    const parser = this.getParser();
    if (!parser)
      throw new ytErrors.ParserError("Parser not found", {
        toParse: this.toParse,
      });
    const parsedData = parser.parse(this.data);
    return parsedData;
  }

  getParser(): abstractParser | void {
    const parserLookup: { [key in parseTypes]: abstractParser } = {
      homePage: new homePage(),
      videoDetail: new ytVideo(),
      searchSuggestions: new searchSuggestions(),
      searchResult: new searchPage(),
    };
    const parser = parserLookup[this.toParse];
    return parser;
  }
}
