import { pageSegment, pageElements } from "../types";
import {
  toplevelIdentifierFinder,
  elementRendererIdentifierFinder,
  itemSectionRendererFinder,
  shelfRenderer,
  shelfSegmentMaker,
  pageSegmentMaker
} from "./stratIdentifiers";

/**
 * The abstract parser class. Extend this class to create a new parser.
 */
export default abstract class YouTubeParser {
  abstract parse(data: any): object;

  protected getSectionElements(itemSection: {
    [key: string]: any;
  }): pageSegment | void {
    const segments = [];
    const sectionList = this.findSectionList(itemSection);
    for (const itemElement of sectionList) {
      const identifier = this.findIdentifiers(itemElement);
      const parsedElement = this.callParsers(
        identifier,
        itemElement
      ) as unknown as pageElements;
      if (parsedElement) segments.push(parsedElement);
    }
    return this.makePageSegment(segments, itemSection);
  }

  protected callParsers(
    identifier: string,
    itemElement: {
      [key: string]: any;
    }
  ): void {}

  protected makePageSegment(
    itemElement: Array<pageElements>,
    contextElement: { [key: string]: any }
  ): pageSegment | void {
    const makers = [new pageSegmentMaker(), new shelfSegmentMaker()];
    for (const maker of makers) {
      const segment = maker.make(itemElement, contextElement);
      if (segment) return segment;
    }
    return undefined;
  }

  protected findIdentifiers(itemElement: { [key: string]: any }): string {
    const finders = [
      new elementRendererIdentifierFinder(),
      new toplevelIdentifierFinder(),
    ];
    for (const finder of finders) {
      const identifier = finder.find(itemElement);
      if (identifier) return identifier;
    }
    return "";
  }

  protected findSectionList(itemSection: { [key: string]: any }): Array<any> {
    const finders = [new itemSectionRendererFinder(), new shelfRenderer()];
    for (const finder of finders) {
      const sectionList = finder.find(itemSection);
      if (sectionList) return sectionList;
    }
    return [];
  }
}
