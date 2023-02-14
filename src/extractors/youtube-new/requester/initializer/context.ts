import { ClientName, YTClient, YTContext } from "extractors/youtube-new/utils/types";
import YT_CONSTANTS from "../../utils/constants";
import UserAgent from "user-agents";
import Errors from "../../../../utils/errors";

export type DeviceType = "DESKTOP_WEB" | "MOBILE_WEB" | "MOBILE_APP";
export type Device = {
  baseURL: string;
  clientName: ClientName;
  clientVersion: string;
  clientFormFactor: string;
  osName: string;
  platform: "DESKTOP" | "MOBILE";
};

export default class Context {
  private devices: Record<DeviceType, Device> = {
    DESKTOP_WEB: {
      baseURL: YT_CONSTANTS.URL.YT_URL,
      clientName: YT_CONSTANTS.YTAPIVAL.CLIENT_WEB_Desktop as ClientName,
      clientVersion: YT_CONSTANTS.YTAPIVAL.VERSION_WEB,
      clientFormFactor: "UNKNOWN_FORM_FACTOR",
      osName: "Macintosh",
      platform: "DESKTOP",
    },
    MOBILE_WEB: {
      baseURL: YT_CONSTANTS.URL.YT_MOBILE,
      clientName: YT_CONSTANTS.YTAPIVAL.CLIENT_WEB_Mobile as ClientName,
      clientVersion: YT_CONSTANTS.YTAPIVAL.VERSION_WEB,
      clientFormFactor: "SMALL_FORM_FACTOR",
      osName: "Android",
      platform: "MOBILE",
    },
    MOBILE_APP: {
      baseURL: YT_CONSTANTS.URL.YT_MOBILE,
      clientName: YT_CONSTANTS.YTAPIVAL.CLIENTNAME as ClientName,
      clientVersion: YT_CONSTANTS.YTAPIVAL.VERSION,
      clientFormFactor: "SMALL_FORM_FACTOR",
      osName: "Android",
      platform: "MOBILE",
    },
  };
  private device: Device;

  constructor(deviceType: DeviceType) {
    if (!deviceType || Object.keys(this.devices).indexOf(deviceType) === -1) {
      throw new Errors.VueTubeExtractorError(
        "Invalid device type used when generating context"
      );
    }
    this.device = this.devices[deviceType];
  }

  getContext(configClient: Partial<YTClient>): YTContext {
    const userAgent = new UserAgent({
      deviceCategory: this.device.platform.toLowerCase(),
    }).data;
    return {
      client: {
        deviceMake: userAgent.vendor,
        deviceModel: userAgent.platform,
        userAgent: userAgent.userAgent,
        clientName: this.device.clientName,
        osName: this.device.osName,
        platform: this.device.platform,
        clientFormFactor: this.device.clientFormFactor,
        ...configClient,
      } as YTClient,
      user: { lockedSafetyMode: false },
      request: { useSsl: true },
    } as YTContext;
  }
}
