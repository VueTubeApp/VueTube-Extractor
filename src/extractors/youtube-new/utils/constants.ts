import { SearchDuration, SearchOrder, SearchType, SearchUploadDate, Features, SearchFeatures } from './types';

export const PLATFORM = {
  MOBILE: 'MOBILE',
  DESKTOP: 'DESKTOP',
} as const;

export const DEVICE_TYPE = {
  DESKTOP_WEB: 'DESKTOP_WEB',
  MOBILE_WEB: 'MOBILE_WEB',
  MOBILE_APP: 'MOBILE_APP',
} as const;

export const CLIENT_FORM_FACTOR = {
  UNKNOWN: 'UNKNOWN_FORM_FACTOR',
  SMALL: 'SMALL_FORM_FACTOR',
} as const;

export const CLIENT_NAME = {
  ANDROID: 'ANDROID',
  IOS: 'IOS',
  WEB: 'WEB',
  MWEB: 'MWEB',
} as const;

export const OS_NAME = {
  ANDROID: 'Android',
  IOS: 'iOS',
  WINDOWS: 'Windows',
  MAC: 'Macintosh',
  LINUX: 'Linux',
  MWEB: 'MWeb',
} as const;

export const PARSE_TYPE = {
  VIDEO_DETAIL: 'videoDetail',
  HOMEPAGE: 'homePage',
  SEARCH_SUGGESTIONS: 'searchSuggestions',
  SEARCH_RESULT: 'searchResult',
} as const;

export const SEARCH_FEATURE = {
  LIVE: 'live',
  VIDEO4K: 'video4k',
  HD: 'hd',
  SUBTITLES: 'subtitles',
  CC: 'cc',
  VIDEO360: 'video360',
  VR180: 'vr180',
  VIDEO3D: 'video3d',
  HDR: 'hdr',
  LOCATION: 'location',
  PURCHASED: 'purchased',
} as const;

export const FEATURE = {
  LIVE: 'featuresLive',
  VIDEO4K: 'features4k',
  HD: 'featuresHd',
  SUBTITLES: 'featuresSubtitles',
  CC: 'featuresCreativeCommons',
  VIDEO360: 'features360',
  VR180: 'featuresVr180',
  VIDEO3D: 'features3d',
  HDR: 'featuresHdr',
  LOCATION: 'featuresLocation',
  PURCHASED: 'featuresPurchased',
} as const;

export const SEARCH_UPLOAD_DATE = {
  HOUR: 'hour',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
  ALL: 'all',
} as const;

export const SEARCH_ORDER = {
  RELEVANCE: 'relevance',
  VIEW_COUNT: 'viewCount',
  RATING: 'rating',
  UPLOAD_DATE: 'uploadDate',
} as const;

export const SEARCH_TYPE = {
  VIDEO: 'video',
  PLAYLIST: 'playlist',
  CHANNEL: 'channel',
  ALL: 'all',
} as const;

export const SEARCH_DURATION = {
  SHORT: 'short',
  MEDIUM: 'medium',
  LONG: 'long',
  ALL: 'all',
} as const;

export const SEARCH_DURATION_OPTIONS: { [key in SearchDuration]: number | null } = {
  [SEARCH_DURATION.ALL]: null,
  [SEARCH_DURATION.SHORT]: 1,
  [SEARCH_DURATION.LONG]: 2,
  [SEARCH_DURATION.MEDIUM]: 3,
} as const;

export const SEARCH_ORDER_OPTIONS: { [key in SearchOrder]: number | null } = {
  [SEARCH_ORDER.RELEVANCE]: 0,
  [SEARCH_ORDER.RATING]: 1,
  [SEARCH_ORDER.UPLOAD_DATE]: 2,
  [SEARCH_ORDER.VIEW_COUNT]: 3,
} as const;

export const SEARCH_TYPE_OPTIONS: { [key in SearchType]: number | null } = {
  [SEARCH_TYPE.ALL]: null,
  [SEARCH_TYPE.VIDEO]: 1,
  [SEARCH_TYPE.CHANNEL]: 2,
  [SEARCH_TYPE.PLAYLIST]: 3,
} as const;

export const SEARCH_UPLOAD_DATE_OPTIONS: { [key in SearchUploadDate]: number | null } = {
  [SEARCH_UPLOAD_DATE.ALL]: null,
  [SEARCH_UPLOAD_DATE.HOUR]: 1,
  [SEARCH_UPLOAD_DATE.DAY]: 2,
  [SEARCH_UPLOAD_DATE.WEEK]: 3,
  [SEARCH_UPLOAD_DATE.MONTH]: 4,
  [SEARCH_UPLOAD_DATE.YEAR]: 5,
} as const;

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

export const COMMENT_SORT_OPTIONS = {
  topComments: 0,
  newestFirst: 1,
} as const;

export const YT_CONSTANTS = {
  URL: {
    YT_URL: 'https://www.youtube.com',
    YT_MOBILE: 'https://m.youtube.com',
    YT_MUSIC_URL: 'https://music.youtube.com',
    YT_BASE_API: 'https://www.youtube.com/youtubei/v1',
    YT_SUGGESTION_API: 'https://suggestqueries.google.com/complete/search',
  },
  YTAPIVAL: {
    VERSION: '17.20',
    CLIENTNAME: CLIENT_NAME.ANDROID,
    VERSION_WEB: '2.20230206.06.00',
    CLIENT_WEB_Mobile: CLIENT_NAME.MWEB,
    CLIENT_WEB_Desktop: CLIENT_NAME.WEB,
  },
} as const;
