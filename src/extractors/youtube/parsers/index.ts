import { ytVideo, abstractParser } from "./strats";
import { ytErrors } from "../utils";
import playerResponse from "../types/playerResponse";
import { ytVideoData } from "../types/parserData";

type parseTypes = "videoDetail";

export default class Parser {
  private toParse: parseTypes;
  private data: ytVideoData | object;

  constructor(toParse: parseTypes, data: object) {
    this.toParse = toParse;
    this.data = data;
  }

  parse(): object {
    let parser: abstractParser | void;
    let formatter;
    switch (this.toParse) {
      case "videoDetail":
        formatter = this.data as ytVideoData;
        if (!formatter.player) {
          throw new ytErrors.ParserError("No player data found", {
            data: this.data,
            id: this.toParse,
          });
        }
        formatter.player = formatter.player as playerResponse;
        this.data = formatter;
        parser = new ytVideo();
        break;
      default:
        break;
    }
    if (!parser)
      throw new ytErrors.ParserError("Parser not found", {
        toParse: this.toParse,
      });
    const parsedData = parser.parse(this.data);
    return parsedData;
  }
}
