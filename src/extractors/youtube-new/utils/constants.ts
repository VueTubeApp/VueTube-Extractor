export default {
  URL: {
    YT_URL: 'https://www.youtube.com',
    YT_MOBILE: 'https://m.youtube.com',
    YT_MUSIC_URL: 'https://music.youtube.com',
    YT_BASE_API: 'https://www.youtube.com/youtubei/v1',
    YT_SUGGESTION_API: 'https://suggestqueries.google.com/complete/search',
  },
  YTAPIVAL: {
    VERSION: '17.20',
    CLIENTNAME: 'ANDROID',
    VERSION_WEB: '2.20230206.06.00',
    CLIENT_WEB_Mobile: 'MWEB',
    CLIENT_WEB_Desktop: 'WEB',
  },
};

export const PLATFORM = {
  MOBILE: 'MOBILE',
  DESKTOP: 'DESKTOP',
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
