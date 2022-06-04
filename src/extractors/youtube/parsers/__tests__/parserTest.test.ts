import parser from "../index";

describe("parser error handling", () => {
  describe("if parser throws error on bad input", () => {
    test("videoDetail", () => {
      const videoDetailParse = new parser("videoDetail", {});
      expect(() => {
        videoDetailParse.parse();
      }).toThrowError("No player data found");
    });
    test("homePage", () => {
      const homePageParse = new parser("homePage", {});
      expect(() => {
        homePageParse.parse();
      }).toThrowError("No section contents");
    });
    test("bad toParse", () => {
      const badParse = new parser("bad" as any, {});
      expect(() => {
        badParse.parse();
      }).toThrowError("Parser not found");
    });
  });
});
