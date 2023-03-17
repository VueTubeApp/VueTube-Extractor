import { FEATURE, SEARCH_FEATURE } from '../utils/constants';
import { Features, SearchFeatures } from '../utils/types';
import { searchFilter, searchFeatures } from './types';

const duration: { [key in searchFilter['duration']]: number | null } = {
  all: null,
  short: 1,
  long: 2,
  medium: 3,
};

const order: { [key in searchFilter['order']]: number | null } = {
  relevance: 0,
  rating: 1,
  uploadDate: 2,
  viewCount: 3,
};

const type: { [key in searchFilter['type']]: number | null } = {
  all: null,
  video: 1,
  channel: 2,
  playlist: 3,
};

const uploadDate: { [key in searchFilter['uploadDate']]: number | null } = {
  all: null,
  hour: 1,
  day: 2,
  week: 3,
  month: 4,
  year: 5,
};

export const SEARCH_FEATURE_BY_FEATURE: { [key in Features]: SearchFeatures } = {
  [FEATURE.HD]: SEARCH_FEATURE.HD,
  [FEATURE.VIDEO4K]: SEARCH_FEATURE.VIDEO4K,
  [FEATURE.VR180]: SEARCH_FEATURE.VR180,
  [FEATURE.SUBTITLES]: SEARCH_FEATURE.SUBTITLES,
  [FEATURE.CC]: SEARCH_FEATURE.CC,
  [FEATURE.VIDEO360]: SEARCH_FEATURE.VIDEO360,
  [FEATURE.VIDEO3D]: SEARCH_FEATURE.VIDEO3D,
  [FEATURE.HDR]: SEARCH_FEATURE.HDR,
  [FEATURE.LOCATION]: SEARCH_FEATURE.LOCATION,
  [FEATURE.PURCHASED]: SEARCH_FEATURE.PURCHASED,
  [FEATURE.LIVE]: SEARCH_FEATURE.LIVE,
} as const;

export const FEATURE_BY_SEARCH_FEATURE: { [key in SearchFeatures]: Features } = {
  [SEARCH_FEATURE.HD]: FEATURE.HD,
  [SEARCH_FEATURE.VIDEO4K]: FEATURE.VIDEO4K,
  [SEARCH_FEATURE.VR180]: FEATURE.VR180,
  [SEARCH_FEATURE.SUBTITLES]: FEATURE.SUBTITLES,
  [SEARCH_FEATURE.CC]: FEATURE.CC,
  [SEARCH_FEATURE.VIDEO360]: FEATURE.VIDEO360,
  [SEARCH_FEATURE.VIDEO3D]: FEATURE.VIDEO3D,
  [SEARCH_FEATURE.HDR]: FEATURE.HDR,
  [SEARCH_FEATURE.LOCATION]: FEATURE.LOCATION,
  [SEARCH_FEATURE.PURCHASED]: FEATURE.PURCHASED,
  [SEARCH_FEATURE.LIVE]: FEATURE.LIVE,
} as const;

const commentSortOptions = { topComments: 0, newestFirst: 1 };

export { duration, order, type, uploadDate, commentSortOptions };
