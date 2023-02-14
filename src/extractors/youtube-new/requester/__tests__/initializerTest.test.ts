import "isomorphic-fetch";
import Errors from "../../../../utils/errors";
import Config from "../initializer/config"

describe("Initializer Tests", () => {
  describe("getInnertubeConfig Tests", () => {
    test("Should get a valid API key and client object", async () => {
      const config = await new Config();
      await config.getInnertubeConfig();
      expect(typeof config.apiKey).toBe("string");
      expect(typeof config.client).toBe("object");
      expect(typeof config.client.gl).toBe("string");
      expect(typeof config.client.hl).toBe("string");
      expect(typeof config.client.clientVersion).toBe("string");
      expect(typeof config.client.remoteHost).toBe("string");
      expect(typeof config.client.visitorData).toBe("string");
    });

    describe("getInnertubeConfig error handling", () => {
       test("Should throw an error if an invalid API URL is provided", async () => {
         const config = await new Config();
         const wrongDataURL = "http://invalid";
         await expect(config.getInnertubeConfig(wrongDataURL)).rejects.toThrow(
           Errors.VueTubeExtractorError
         );
       });

      test("Should throw an error if an invalid data structure is returned", async () => {
        const config = await new Config();
        const wrongDataURL = "http://example.com"; // returns 200 OK for all routes
        await expect(config.getInnertubeConfig(wrongDataURL)).rejects.toThrow(
          Errors.VueTubeExtractorError
        );
      });
    })
  });
});
