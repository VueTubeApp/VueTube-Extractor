import { ytVideo, abstractParser } from "./strats";
import { ytErrors } from "../utils";

type parseTypes = "videoDetail";

export default class Parser {
  private toParse: parseTypes;
  private data: object;

  constructor(toParse: parseTypes, data: object) {
    this.toParse = toParse;
    this.data = data;
  }

  parse(): object {
    let parser: abstractParser | void;
    switch (this.toParse) {
      case "videoDetail":
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
