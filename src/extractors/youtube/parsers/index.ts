import {
  ytVideo,
  abstractParser,
  homePage,
  searchSuggestions,
  searchPage,
} from "./strats";
import { ytErrors } from "../utils";
import { playerResponse, parseTypes } from "../types";

export default class Parser {
  private toParse: parseTypes;
  private data: playerResponse | object;

  constructor(toParse: parseTypes, data: object) {
    this.toParse = toParse;
    this.data = data;
  }

  parse(): object | void {
    try {
      const parser = this.getParser();
      if (!parser)
        throw new ytErrors.ParserError("Parser not found", {
          toParse: this.toParse,
        });
      const parsedData = parser.parse(this.data);
      return parsedData;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): void {
    if (error instanceof ytErrors.YoutubeError) {
      throw error;
    } else if (error instanceof Error) {
      throw new ytErrors.ParserError(error.message, {
        toParse: this.toParse,
      });
    } else {
      throw new ytErrors.ParserError("Unknown error", {
        toParse: this.toParse,
      });
    }
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
