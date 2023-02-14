import "isomorphic-fetch";
import Errors from "../../../../utils/errors";
import Config from "../initializer/config"
import Context, { type DeviceType } from "../initializer/context";

describe("Initializer Tests", () => {
  let validConfig: Config;

  beforeAll(async () => {
    validConfig = new Config();
    await validConfig.getInnertubeConfig();
  });

  describe("Config Tests", () => {
    test("Should get a valid API key and client object", async () => {
      expect(typeof validConfig.apiKey).toBe("string");
      expect(typeof validConfig.client).toBe("object");
      expect(typeof validConfig.client.gl).toBe("string");
      expect(typeof validConfig.client.hl).toBe("string");
      expect(typeof validConfig.client.clientVersion).toBe("string");
      expect(typeof validConfig.client.remoteHost).toBe("string");
      expect(typeof validConfig.client.visitorData).toBe("string");
    });

    describe("getInnertubeConfig error handling", () => {
      test("Should throw an error if an invalid API URL is provided", async () => {
        const config = new Config();
        const wrongDataURL = "http://invalid";
        await expect(config.getInnertubeConfig(wrongDataURL)).rejects.toThrow(
          Errors.VueTubeExtractorError
        );
      });

      test("Should throw an error if an invalid data structure is returned", async () => {
        const config = new Config();
        const wrongDataURL = "http://example.com"; // returns 200 OK for all routes
        await expect(config.getInnertubeConfig(wrongDataURL)).rejects.toThrow(
          Errors.VueTubeExtractorError
        );
      });
    });
  });

  describe("Context Tests", () => {
    test("Should get a valid context object for any valid device type", async () => {
      const validDeviceTypes = ["MOBILE_WEB", "MOBILE_APP", "DESKTOP_WEB"];
      for (let i = 0; i < validDeviceTypes.length; i += 1) {
        const context = new Context(validDeviceTypes[i] as DeviceType).getContext(validConfig.client);
        expect(typeof context).toBe("object");
        expect(typeof context.client).toBe("object");
        expect(typeof context.client.gl).toBe("string");
        expect(typeof context.client.hl).toBe("string");
        expect(typeof context.client.deviceMake).toBe("string");
        expect(typeof context.client.deviceModel).toBe("string");
        expect(typeof context.client.userAgent).toBe("string");
        expect(["ANDROID", "IOS", "WEB", "MWEB"]).toContain(
          context.client.clientName
        );
        expect(typeof context.client.clientVersion).toBe("string");
        expect([
          "Android",
          "iOS",
          "Windows",
          "Macintosh",
          "Linux",
          "MWeb",
        ]).toContain(context.client.osName);
        expect(["MOBILE", "DESKTOP"]).toContain(context.client.platform);
        expect(typeof context.client.remoteHost).toBe("string");
        expect(typeof context.client.clientFormFactor).toBe("string");
        expect(typeof context.client.visitorData).toBe("string");
      }
    });

    describe("getInnertubeConfig error handling", () => {
      test("Should throw an error if an invalid device type is provided", async () => {
        expect(() => new Context("WRONG" as DeviceType)).toThrow(Errors.VueTubeExtractorError);
      });
    });
  });
});
