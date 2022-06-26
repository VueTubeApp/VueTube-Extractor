import pageParser from "../pageParser";
import { ytPageParseResults, continuation, searchResult } from "../../types";
import { ytErrors } from "../../utils";

export default class homePage extends pageParser {
  parse(data: { [key: string]: any }): ytPageParseResults<searchResult> {
    const sectionRoot =
      data.continuationContents?.sectionListContinuation ||
      data.contents?.sectionListRenderer;

    const sectionContents = sectionRoot?.contents;
    if (!sectionContents)
      throw new ytErrors.ParserError("No section contents", {
        receivedObject: data,
      });

    const response: ytPageParseResults<searchResult> = {
      page: {
        segments: [],
        chips: [],
        searchRefinements: data.refinements,
        resultCount: data.estimatedResults,
      },
    };

    for (const itemSection of sectionContents) {
      const nextSection = super._getSectionElements(itemSection);
      if (nextSection) response.page.segments.push(nextSection);
    }

    const continuationsData = this._callParsers(
      "continuations",
      sectionRoot.continuations
    ) as unknown as continuation;

    if (continuationsData) response.Continuation = continuationsData;

    return response;
  }
}
