import "isomorphic-fetch";
import Config from "../initializer/config"

describe("Initializer Tests", () => {
  describe("getDefaultConfig Tests", () => {
    test("test", async () => {
      const config = await new Config().getDefaultConfig();
      expect(typeof config.apiKey).toBe("string");
    });
  });
});
