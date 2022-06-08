import abstractParser from "../abstractParser";
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
      response.segments.concat(this.getSectionElements(itemSection));
    }

    return response;
  }

  getSectionElements(itemSection: { [key: string]: any }): Array<pageSegment> {
    const segments = [];
    for (const itemElement of itemSection.itemSectionRenderer.contents) {
      const newElement = itemElement.elementRenderer.newElement;
      const identifier: string =
        newElement.properties.identifierProperties.identifier.split(".")[0];
      if (!parserStrats[identifier]) continue;
      const parsedElement = parserStrats[identifier].parserObj.parse(
        itemElement
      ) as pageSegment;
      segments.push(parsedElement);
    }
    return segments;
  }
}
