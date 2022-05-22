// import { getAPI } from "../src/main";

// test("the data is peanut butter", () => {
//   expect(1).toBe(1);
// });

// test("getAPI", () => {
//   expect(getAPI("https://postman-echo.com/get?test=123")).toBe({});
// });

const fetch = require("isomorphic-fetch"); // So that fetch is available in the test environment
import { YouTube } from "../src";
import { getYoutubeVideoInfoTest, YoutubeVideoInfoErrorTest } from "./cases";

// Mock
import initialization from "../src/extractors/youtube/core/initializer";


describe("YouTube test suite", () => {
  let globalYoutube: YouTube;
  beforeAll(async function () {
    globalYoutube = await new YouTube().init();
  });

  describe("initilization tests", () => {
    test("if init can handle error during initialization", async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => { }); // Supress console warns
      const mockInit = jest.spyOn(initialization.prototype, "buildAsync").mockRejectedValue(new Error("test"));
      const youtube = new YouTube();
      await expect(youtube.init()).rejects.toThrow();
      expect(mockInit).toHaveBeenCalled();
    })
  })


  describe("getVideoInfo tests", () => {
    beforeAll(function () {
      jest.unmock("@capacitor-community/http");
    })
    test.each(getYoutubeVideoInfoTest)(
      "if getVideoInfo works as expected",
      async function (testCase) {
        const result = await globalYoutube.getVideoDetails(testCase.input);
        expect(result).toMatchObject(testCase.expected);
      }
    );
    test.each(YoutubeVideoInfoErrorTest)(
      "if getVideoInfo handles errors correctly",
      async function (testCase) {
        await expect(
          globalYoutube.getVideoDetails(testCase.input)
        ).rejects.toThrow(testCase.expected as Error);
      }
    );
  });
});
