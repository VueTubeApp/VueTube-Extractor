// const fetch = require("isomorphic-fetch"); // So that fetch is available in the test environment. This will not be needed if using node 18.
// import { YouTube } from "../src";
// import { getYoutubeVideoInfoTest, YoutubeVideoInfoErrorTest } from "./cases";
//
// // Mock
// import initialization from "../src/extractors/youtube/core/initializer";
//
// describe("YouTube test suite", () => {
//   let globalYoutube: YouTube;
//   beforeAll(async function () {
//     globalYoutube = await new YouTube().init();
//   });
//
//   describe("initilization tests", () => {
//     test("if init can handle error during initialization", async () => {
//       jest.spyOn(console, "warn").mockImplementation(() => { }); // Supress console warns
//       const mockInit = jest
//         .spyOn(initialization.prototype, "buildAsync")
//         .mockRejectedValue(new Error("test"));
//       const youtube = new YouTube();
//       await expect(youtube.init()).rejects.toThrow();
//       expect(mockInit).toHaveBeenCalled();
//     });
//   });
//
//   describe("getVideoInfo tests", () => {
//     beforeAll(function () {
//       jest.unmock("@vuetubeapp/http");
//     });
//     test.each(getYoutubeVideoInfoTest)(
//       "if getVideoInfo works as expected",
//       async function (testCase) {
//         const result = await globalYoutube.getVideoDetails(testCase.input);
//         expect(result).toMatchObject(testCase.expected);
//       }
//     );
//     test.each(YoutubeVideoInfoErrorTest)(
//       "if getVideoInfo handles errors correctly",
//       async function (testCase) {
//         await expect(
//           globalYoutube.getVideoDetails(testCase.input)
//         ).rejects.toThrow(testCase.expected as Error);
//       }
//     );
//   });
//
//   test("if home page can be fetched", async () => {
//     const result = await globalYoutube.getHomePage();
//     expect(result).toBeDefined();
//     expect(result.continue).toBeDefined();
//     const continued = await result.continue?.();
//     expect(continued).toBeDefined();
//   }, 30000);
//
//   test("if search page can be fetched", async () => {
//     const result = await globalYoutube.getSearchPage("LTT");
//     expect(result).toBeDefined();
//     expect(result.continue).toBeDefined();
//     // const continued = await result.continue?.();
//     // expect(continued).toBeDefined();
//   }, 30000);
//
//   test("if search suggestions can be fetched", async () => {
//     const result = await globalYoutube.getSearchSuggestions("test");
//     expect(result).toBeDefined();
//   });
// });

test("tests on the old youtube extractor is now disabled as it is no longer maintained", () => {
  expect(true).toBe(true);
});
