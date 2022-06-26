import VideoContextParser from "./VideoContextParser";
import privateChannelRendererParser from "./ChannelRendererParser";
import privateCellDividerParser from "./CellDividerParser";
import abstractParser from "../abstractParser";
import Continuations from "./Continuations";

const parserStrats: {
  [key: string]: abstractParser;
} = {
  videoWithContextModel: new VideoContextParser(),
  videoWithContextSlotsModel: new VideoContextParser(),
  compactChannelRenderer: new privateChannelRendererParser(),
  cellDividerModel: new privateCellDividerParser(),
  continuations: new Continuations(),
};

export default parserStrats;
