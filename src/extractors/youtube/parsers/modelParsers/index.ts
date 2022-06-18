import privateVideoContextParser from "./VideoContextParser";
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
};

export default parserStrats;
