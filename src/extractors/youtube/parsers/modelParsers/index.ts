import privateVideoContextParser from "./VideoContextParser";
import privateChannelRendererParser from "./channelRendererParser";
import privateCellDividerParser from "./cellDividerParser";
import abstractParser from "../abstractParser";
import { pageSegmentTypes } from "../../types";

const parserStrats: {
  [key: string]: {
    parserObj: abstractParser;
    segmentType: pageSegmentTypes;
  };
} = {
  videoWithContextModel: {
    parserObj: new privateVideoContextParser(),
    segmentType: "genericSegment",
  },
  videoWithContextSlotsModel: {
    parserObj: new privateVideoContextParser(),
    segmentType: "genericSegment",
  },
  compactChannelRenderer: {
    parserObj: new privateChannelRendererParser(),
    segmentType: "genericSegment",
  },
  cellDividerModel: {
    parserObj: new privateCellDividerParser(),
    segmentType: "divider",
  }
};

export default parserStrats;
