import { ytVideo, abstractParser, homePage } from "./strats";
import { ytErrors } from "../utils";
import { ytVideoData, playerResponse } from "../types";

type parseTypes = "videoDetail" | "homePage";

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
        this.data = formatter;
        parser = new ytVideo();
        break;
      case "homePage":
        parser = new homePage();
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
