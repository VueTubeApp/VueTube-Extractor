import {abstractParser, homePage, parsersList, searchPage, searchSuggestions, ytVideo,} from "./strats";
import {ytErrors} from "../utils";
import {parseTypes, playerResponse} from "../types";

export default class Parser {
  private readonly toParse: parseTypes;
  private readonly data: playerResponse | object;

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
      return parser.parse(this.data);
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

  getParser = (): abstractParser | void => {
    const parserStrats: parsersList = {
      homePage: homePage,
      videoDetail: ytVideo,
      searchSuggestions,
      searchResult: searchPage,
    };
    const parser = parserStrats[this.toParse];
    if (!parser) {
      return undefined;
    }
    return new parser();
  };
}
