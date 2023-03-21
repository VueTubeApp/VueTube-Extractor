import { Device, DeviceType, YTClient, YTContext } from 'extractors/youtube-new/utils/types';
import UserAgent from 'user-agents';
import Errors from '../../../../utils/errors';
import { DEVICE_CONFIG } from './consts/context.const';

export class Context {
  private device: Device;

  constructor(deviceType: DeviceType) {
    if (!deviceType || Object.keys(DEVICE_CONFIG).indexOf(deviceType) === -1) {
      throw new Errors.VueTubeExtractorError('Invalid device type used when generating context');
    }
    this.device = DEVICE_CONFIG[deviceType];
  }

  getContext(configClient: Partial<YTClient>): YTContext {
    const { clientName, osName, platform, clientFormFactor } = this.device;

    const userAgentData = new UserAgent({ deviceCategory: platform.toLowerCase() }).data;

    const { vendor: deviceMake, platform: deviceModel, userAgent } = userAgentData;

    return {
      client: {
        deviceMake,
        deviceModel,
        userAgent,
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
