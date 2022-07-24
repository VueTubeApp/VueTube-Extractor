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

interface commentOptions {
  sortBy?: "topComments" | "newestFirst";
  type?: number;
}

export { searchProto, protoFilters, commentOptions };
