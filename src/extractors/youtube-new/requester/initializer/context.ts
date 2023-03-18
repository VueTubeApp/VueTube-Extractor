import { ClientName, Device, DeviceType, YTClient, YTContext } from 'extractors/youtube-new/utils/types';
import YT_CONSTANTS, { OS_NAME, PLATFORM } from '../../utils/constants';
import UserAgent from 'user-agents';
import Errors from '../../../../utils/errors';

export default class Context {
  private devices: Record<DeviceType, Device> = {
    DESKTOP_WEB: {
      baseURL: YT_CONSTANTS.URL.YT_URL,
      clientName: YT_CONSTANTS.YTAPIVAL.CLIENT_WEB_Desktop as ClientName,
      clientVersion: YT_CONSTANTS.YTAPIVAL.VERSION_WEB,
      clientFormFactor: 'UNKNOWN_FORM_FACTOR',
      osName: OS_NAME.MAC,
      platform: PLATFORM.DESKTOP,
    },
    MOBILE_WEB: {
      baseURL: YT_CONSTANTS.URL.YT_MOBILE,
      clientName: YT_CONSTANTS.YTAPIVAL.CLIENT_WEB_Mobile as ClientName,
      clientVersion: YT_CONSTANTS.YTAPIVAL.VERSION_WEB,
      clientFormFactor: 'SMALL_FORM_FACTOR',
      osName: OS_NAME.ANDROID,
      platform: PLATFORM.MOBILE,
    },
    MOBILE_APP: {
      baseURL: YT_CONSTANTS.URL.YT_MOBILE,
      clientName: YT_CONSTANTS.YTAPIVAL.CLIENTNAME as ClientName,
      clientVersion: YT_CONSTANTS.YTAPIVAL.VERSION,
      clientFormFactor: 'SMALL_FORM_FACTOR',
      osName: OS_NAME.ANDROID,
      platform: PLATFORM.MOBILE,
    },
  };
  private device: Device;

  constructor(deviceType: DeviceType) {
    if (!deviceType || Object.keys(this.devices).indexOf(deviceType) === -1) {
      throw new Errors.VueTubeExtractorError('Invalid device type used when generating context');
    }
    this.device = this.devices[deviceType];
  }

  getContext(configClient: Partial<YTClient>): YTContext {
    const { clientName, osName, platform, clientFormFactor } = this.device;

    const userAgent = new UserAgent({
      deviceCategory: platform.toLowerCase(),
    }).data;

    return {
      client: {
        deviceMake: userAgent.vendor,
        deviceModel: userAgent.platform,
        userAgent: userAgent.userAgent,
        clientName,
        osName,
        platform,
        clientFormFactor,
        ...configClient,
      } as YTClient,
      user: { lockedSafetyMode: false },
      request: { useSsl: true },
    } as YTContext;
  }
}
