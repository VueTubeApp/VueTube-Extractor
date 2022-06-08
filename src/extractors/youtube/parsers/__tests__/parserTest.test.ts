import parser from "../index";
import { parseTypes } from "../../types";

describe("parser error handling", () => {
  const cases: Array<{ parser: parseTypes; errorCode: string }> = [
    { parser: "videoDetail", errorCode: "No player data found" },
    { parser: "homePage", errorCode: "No section contents" },
    { parser: "bad" as any, errorCode: "Parser not found" },
  ];
  describe.each(cases)("$parser", (caseData) => {
    const parserInstance = new parser(caseData.parser, {});
    test("if parser throws error on bad input", () => {
      expect(() => {
        parserInstance.parse();
      }).toThrowError(caseData.errorCode);
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
