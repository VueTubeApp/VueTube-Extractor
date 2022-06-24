import { MixinConstructor } from "@types";
import { pageSegment, pageElements } from "../../types";
import {
  toplevelIdentifierFinder,
  elementRendererIdentifierFinder,
  itemSectionRendererFinder,
  shelfRenderer,
  shelfSegmentMaker,
  pageSegmentMaker,
} from "../stratIdentifiers";

export default function section<TBase extends MixinConstructor>(Base: TBase) {
  return class extends Base {
    _getSectionElements(itemSection: {
      [key: string]: any;
    }): pageSegment | void {
      const segments = [];
      const sectionList = this._findSectionList(itemSection);
      for (const itemElement of sectionList) {
        const identifier = this._findIdentifiers(itemElement);
        const parsedElement = this._callParsers(
          identifier,
          itemElement
        ) as unknown as pageElements;
        if (parsedElement) segments.push(parsedElement);
      }
      return this._makePageSegment(segments, itemSection);
    }

    _callParsers(
      identifier: string,
      itemElement: {
        [key: string]: any;
      }
    ): void { }

    _makePageSegment(
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

    _findIdentifiers(itemElement: { [key: string]: any }): string {
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

    _findSectionList(itemSection: {
      [key: string]: any;
    }): Array<any> {
      const finders = [new itemSectionRendererFinder(), new shelfRenderer()];
      for (const finder of finders) {
        const sectionList = finder.find(itemSection);
        if (sectionList) return sectionList;
      }
      return [];
    }
  };
}