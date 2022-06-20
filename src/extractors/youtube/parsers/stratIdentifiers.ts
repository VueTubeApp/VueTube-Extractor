import { pageSegment, shelfSegment, pageElements } from "../types";
import { YtUtils } from "../utils";

interface sectionListFinder {
  find(itemSection: { [key: string]: any }): Array<any> | void;
}

interface identityFinder {
  find(itemElement: { [key: string]: any }): string | void;
}

interface pageSegmentMaker {
  make(
    itemSection: { [key: string]: any },
    contextSection: { [key: string]: any }
  ): pageSegment | void;
}

// RENDERER IDENTIFIERS

class elementRendererIdentifierFinder implements identityFinder {
  find(itemElement: { [key: string]: any }): string | void {
    const model = itemElement?.elementRenderer?.newElement?.type?.componentType?.model
    if (model) return Object.keys(model)[0]; else return undefined;
  }
}

class toplevelIdentifierFinder implements identityFinder {
  find(itemElement: { [key: string]: any }) {
    const identifier: string = Object.keys(itemElement)[0];
    return identifier;
  }
}

// SECTION LIST FINDERS
class itemSectionRendererFinder implements sectionListFinder {
  find(itemSection: { [key: string]: any }) {
    return itemSection.itemSectionRenderer?.contents;
  }
}

class shelfRenderer implements sectionListFinder {
  find(itemSection: { [key: string]: any }) {
    return itemSection.shelfRenderer?.content?.verticalListRenderer?.items;
  }
}

// PAGE SEGMENT MAKERS
class pageSegmentMaker implements pageSegmentMaker {
  make(
    itemSection: Array<pageElements>,
    contextSection: { [key: string]: any }
  ): pageSegment | void {
    if (new itemSectionRendererFinder().find(contextSection)) {
      return {
        type: "genericSegment",
        contents: itemSection,
      };
    }
    return undefined;
  }
}

class shelfSegmentMaker implements pageSegmentMaker {
  make(
    itemSection: Array<pageElements>,
    contextSection: { [key: string]: any }
  ): shelfSegment | void {
    if (new shelfRenderer().find(contextSection)) {
      return {
        type: "shelf",
        contents: itemSection,
        header:
          contextSection.shelfRenderer?.headerRenderer?.elementRenderer
            ?.newElement?.type?.componentType?.model
            ?.shelfHeaderModel?.shelfHeaderData?.title,
        collapseCount:
          contextSection.shelfRenderer?.content?.verticalListRenderer
            ?.collapsedItemCount || undefined,
        collapseText: YtUtils.getStringFromRuns(contextSection.shelfRenderer?.content?.verticalListRenderer?.collapsedStateButtonText
          ?.runs),
      };
    }
    return undefined;
  }
}

export {
  elementRendererIdentifierFinder,
  toplevelIdentifierFinder,
  itemSectionRendererFinder,
  shelfRenderer,
  pageSegmentMaker,
  shelfSegmentMaker,
};
