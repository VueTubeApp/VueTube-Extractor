import pageParser from "../pageParser";
import { genericPage } from "../../types";
import { ytErrors } from "../../utils";

export default class homePage extends pageParser {
  parse(data: { [key: string]: any }): genericPage {
    const sectionContents = (
      data.continuationContents?.sectionListContinuation ||
      data.contents?.singleColumnBrowseResultsRenderer?.tabs[0]?.tabRenderer
        ?.content.sectionListRenderer
    )?.contents;
    if (!sectionContents)
      throw new ytErrors.ParserError("No section contents", {
        receivedObject: data,
      });

    const response: genericPage = { segments: [], chips: [] };

    for (const itemSection of sectionContents) {
      const nextSection = super._getSectionElements(itemSection);
      if (nextSection) response.segments = response.segments.concat(
        nextSection
      );
    }

    return response;
  }
}
