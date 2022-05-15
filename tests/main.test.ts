// import { getAPI } from "../src/main";

// test("the data is peanut butter", () => {
//   expect(1).toBe(1);
// });

// test("getAPI", () => {
//   expect(getAPI("https://postman-echo.com/get?test=123")).toBe({});
// });

const fetch = require("isomorphic-fetch"); // So that fetch is available in the test environment
import { YouTube } from "../src";
import cases from "./cases";

describe("YouTube test suite", () => {
  let globalYoutube: YouTube;
  beforeAll(async function () {
    globalYoutube = await new YouTube().initAsync();
  });

  test("if getVideoInfoAsync works as expected", async function () {
    await cases.getYoutubeVideoInfoTest.forEach(async (testCase) => {
      const result = await globalYoutube.getVideoDetails(testCase.input);
      expect(result).toEqual(expect.objectContaining(testCase.expected));
    });
  });
});
