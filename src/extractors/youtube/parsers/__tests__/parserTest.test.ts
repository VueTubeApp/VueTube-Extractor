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

describe("parser handling", () => {
  test("searchSuggestions", () => {
    const testData = {
      data: [
        "LTT",
        [
          ["ltt", 0, [512, 433]],
          ["ltt intel extreme upgrade", 0, [512]],
          ["ltt game nerf war", 0, [512, 433]],
          ["ltt april fools", 0, [512, 433]],
          ["ltt keymouse", 0, [512]],
        ],
        { k: 1, q: "PNWEva_a9eulPp0wIyXVaUqAThs" },
      ],
      expected: {
        query: "LTT",
        results: [
          "ltt",
          "ltt intel extreme upgrade",
          "ltt game nerf war",
          "ltt april fools",
          "ltt keymouse",
        ],
      },
    };
    const searchSuggestionsParse = new parser(
      "searchSuggestions",
      testData.data
    ).parse();
    expect(searchSuggestionsParse).toStrictEqual(testData.expected);
  });
});
