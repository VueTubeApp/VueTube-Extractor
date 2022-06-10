import { pageSegment } from "../types";

/**
 * The abstract parser class. Extend this class to create a new parser.
 */
export default abstract class YouTubeParser {
  abstract parse(data: any): object;

  protected getSectionElements(itemSection: {
    [key: string]: any;
  }): Array<pageSegment> {
    const segments = [];
    for (const itemElement of itemSection.itemSectionRenderer.contents) {
      const newElement = itemElement.elementRenderer.newElement;
      const identifier: string = Object.keys(
        newElement.type.componentType.model
      )[0];
      const parsedElement = this.callParsers(
        identifier,
        itemElement
      ) as unknown as pageSegment;
      if (parsedElement) segments.push(parsedElement);
    }
    return segments;
  }

  protected callParsers(
    identifier: string,
    itemElement: {
      [key: string]: any;
    }
  ): void {}
}
