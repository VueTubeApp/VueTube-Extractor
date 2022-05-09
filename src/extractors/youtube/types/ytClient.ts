type ytClient = {
  gl: string;
  hl: string;
  deviceMake?: string;
  deviceModel?: string;
  userAgent: string;
  clientName: "ANDROID" | "IOS" | 1 | 2;
  clientVersion: string;
  osName: "Android" | "iOS" | "Windows" | "MacOS" | "Linux" | "MWeb";
  osVersion?: number;
  platform: "MOBILE" | "DESKTOP";
  remoteHost?: string;
  visitorData?: string;
};

export default ytClient;
