interface sectionListFinder {
  find(itemSection: { [key: string]: any }): Array<any> | void;
}

interface identityFinder {
  find(itemElement: { [key: string]: any }): string | void;
}

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

class itemSectionRendererFinder implements sectionListFinder {
  find(itemSection: { [key: string]: any }) {
    return itemSection.itemSectionRenderer?.contents;
  }
}

class shelfRenderer implements sectionListFinder {
  find(itemSection: { [key: string]: any }) {
    // return itemSection.shelfRenderer?.contents?.verticalListRenderer?.items;
    return [];
  }
}

export {
  elementRendererIdentifierFinder,
  toplevelIdentifierFinder,
  itemSectionRendererFinder,
  shelfRenderer,
};
