import { Root, Type, loadSync } from "protobufjs";
import path from "path";
import { searchFilter, searchFeatures } from "../types";
import { duration, order, type, uploadDate } from "./conversion";
import { ytErrors } from "../utils";

class Proto {
  private protoRoot: Root;
  constructor() {
    this.protoRoot = loadSync(path.join(__dirname, "youtube.proto"));
  }

  /**
   * encodes Visitor Data to protobuf format
   *
   * @param {string} id - visitor id. Should be an 11 character long random string
   * @param {number} timestamp - timestamp of initialization
   *
   * @returns {string} encoded visitor data
   */
  encodeVisitorData(id: string, timestamp: number): string {
    const visitorData: Type = this.protoRoot.lookupType("youtube.VisitorData");
    const buf: Uint8Array = visitorData.encode({ id, timestamp }).finish();
    return encodeURIComponent(Buffer.from(buf).toString("base64"));
  }

  /**
   * encodes search filter to protobuf format
   * @param {Partial<searchFilter>} filters - search filters
   * @returns {string} encoded search filter
   */
  encodeSearchFilter(filters: Partial<searchFilter>): string {
    if (filters?.uploadDate && filters?.type !== "video") {
      throw new ytErrors.SearchError(
        JSON.stringify(filters),
        "Search filter type must be video"
      );
    }
    const data: searchProto = filters ? { filters: {} } : { noFilter: 0 };
    if (data.filters) {
      data.filters = {
        ...data.filters,
        ...filters.uploadDate && { param_0: uploadDate[filters.uploadDate] },
        ...filters.type && { param_1: type[filters.type] },
        ...filters.duration && { param_2: duration[filters.duration] },
        ...filters.order && { sort: order[filters.order] },
      }
      if (filters.features) {
        for (const feature of filters.features) {
          data.filters[features[feature] as keyof protoFilters] = 1
        }
      }
    }
    const searchFilter: Type = this.protoRoot.lookupType(
      "youtube.SearchFilter"
    );
    const buf: Uint8Array = searchFilter.encode(data).finish();
    return encodeURIComponent(Buffer.from(buf).toString("base64"));
  }
}

const singletonProto = new Proto();

Object.freeze(singletonProto);

export default singletonProto;

const features: { [key in searchFeatures]: string } = {
  hd: "featuresHd",
  video4k: "features4k",
  vr180: "featuresVr180",
  subtitles: "featuresSubtitles",
  cc: "featuresCreativeCommons",
  video360: "features360",
  video3d: "features3d",
  hdr: "featuresHdr",
  location: "featuresLocation",
  purchased: "featuresPurchased",
  live: "featuresLive",
};
interface searchProto {
  sort?: number | null;
  noFilter?: number | null;
  noCorrection?: number | null;
  filters?: protoFilters;
}
interface protoFilters {
  param_0?: number | null;
  param_1?: number | null;
  param_2?: number | null;
  featuresHd?: number | null;
  features4k?: number | null;
  featuresVr180?: number | null;
  featuresSubtitles?: number | null;
  featuresCreativeCommons?: number | null;
  features360?: number | null;
  features3d?: number | null;
  featuresHdr?: number | null;
  featuresLocation?: number | null;
  featuresPurchased?: number | null;
  featuresLive?: number | null;
}
