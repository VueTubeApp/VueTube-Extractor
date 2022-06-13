import pageParser from "../pageParser";
import { searchResult } from "../../types";
import { ytErrors } from "../../utils";

export default class homePage extends pageParser {
  parse(data: { [key: string]: any }): searchResult {
    const sectionContents = (
      data.continuationContents?.sectionListContinuation ||
      data.contents?.sectionListRenderer
    )?.contents;
    if (!sectionContents)
      throw new ytErrors.ParserError("No section contents", {
        receivedObject: data,
      });

    const response: searchResult = {
      segments: [],
      chips: [],
      searchRefinements: data.refinements,
      resultCount: data.estimatedResults,
    };

    for (const itemSection of sectionContents) {
      response.segments = response.segments.concat(
        super.getSectionElements(itemSection)
      );
    }

    return response;
  }
}
