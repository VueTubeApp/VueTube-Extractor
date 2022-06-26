import pageParser from "../pageParser";
import { ytPageParseResults, continuation, genericPage } from "../../types";
import { ytErrors } from "../../utils";

export default class homePage extends pageParser {
  parse(data: { [key: string]: any }): ytPageParseResults<genericPage> {
    const sectionRoot =
      data.continuationContents?.sectionListContinuation ||
      data.contents?.singleColumnBrowseResultsRenderer?.tabs[0]?.tabRenderer
        ?.content.sectionListRenderer;
    const sectionContents = sectionRoot?.contents;
    if (!sectionContents)
      throw new ytErrors.ParserError("No section contents", {
        receivedObject: data,
      });

    const response: ytPageParseResults<genericPage> = {
      page: { segments: [], chips: [] },
    };

    for (const itemSection of sectionContents) {
      const nextSection = this._getSectionElements(itemSection);
      if (nextSection)
        response.page.segments = response.page.segments.concat(nextSection);
    }

    const continuationsData = this._callParsers(
      "continuations",
      sectionRoot.continuations
    ) as unknown as continuation;

    if (continuationsData) response.Continuation = continuationsData;
    return response;
  }
}
