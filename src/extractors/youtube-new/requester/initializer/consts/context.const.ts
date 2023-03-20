import { DEVICE_TYPE, YT_CONSTANTS, OS_NAME, PLATFORM, CLIENT_FORM_FACTOR } from '../../../utils/constants';
import { DeviceType, Device } from '../../../utils/types';

export const DEVICE_CONFIG: Record<DeviceType, Device> = {
  [DEVICE_TYPE.DESKTOP_WEB]: {
    baseURL: YT_CONSTANTS.URL.YT_URL,
    clientName: YT_CONSTANTS.YTAPIVAL.CLIENT_WEB_Desktop,
    clientVersion: YT_CONSTANTS.YTAPIVAL.VERSION_WEB,
    clientFormFactor: CLIENT_FORM_FACTOR.UNKNOWN,
    osName: OS_NAME.MAC,
    platform: PLATFORM.DESKTOP,
  },
  [DEVICE_TYPE.MOBILE_WEB]: {
    baseURL: YT_CONSTANTS.URL.YT_MOBILE,
    clientName: YT_CONSTANTS.YTAPIVAL.CLIENT_WEB_Mobile,
    clientVersion: YT_CONSTANTS.YTAPIVAL.VERSION_WEB,
    clientFormFactor: CLIENT_FORM_FACTOR.SMALL,
    osName: OS_NAME.ANDROID,
    platform: PLATFORM.MOBILE,
  },
  [DEVICE_TYPE.MOBILE_APP]: {
    baseURL: YT_CONSTANTS.URL.YT_MOBILE,
    clientName: YT_CONSTANTS.YTAPIVAL.CLIENTNAME,
    clientVersion: YT_CONSTANTS.YTAPIVAL.VERSION,
    clientFormFactor: CLIENT_FORM_FACTOR.SMALL,
    osName: OS_NAME.ANDROID,
    platform: PLATFORM.MOBILE,
  },
} as const;
