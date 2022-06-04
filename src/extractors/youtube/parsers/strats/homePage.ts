import abstractParser from "./abstractParser";
import { pageSegment, genericPage, pageSegmentTypes } from "../../types";
import { ytErrors } from "../../utils";

import privateVideoContextParser from "./privateVideoContextParser";

const parserStrats: {
  [key: string]: {
    parserObj: abstractParser;
    segmentType: pageSegmentTypes;
  };
} = {
  home_video_with_context: {
    parserObj: new privateVideoContextParser(),
    segmentType: "video",
  },
};
export default class homePage implements abstractParser {
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
      for (const itemElement of itemSection.itemSectionRenderer?.contents) {
        const newElement = itemElement.elementRenderer.newElement;
        const identifier: string =
          newElement.properties.identifierProperties.identifier;
        if (parserStrats[identifier.split(".")[0]]) {
          response.segments.push(
            parserStrats[identifier.split(".")[0]].parserObj.parse(
              itemElement
            ) as pageSegment
          );
        }
      }
    }

    return response;
  }
}
