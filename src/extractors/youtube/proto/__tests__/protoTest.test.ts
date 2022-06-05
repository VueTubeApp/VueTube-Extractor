import proto from "../index";
import * as cases from "./testCases.json";
import { searchFilter } from "../../types";

describe("protobuf parsing tests", () => {
  describe("if encodeVisitorData works", () => {
    test.each(cases.encodeVisitorData)(
      "%s and %s should be %s",
      (input1, input2, expectResult) => {
        const visitorData = proto.encodeVisitorData(
          input1 as string,
          input2 as number
        );
        expect(visitorData).toBe(expectResult);
      }
    );
  });
  describe("if encodeSearchFilter works", () => {
    test.each(
      cases.encodeSearchFilter as unknown as [Partial<searchFilter>, string]
    )("%s should be %s ", (input1, expectResult) => {
      const searchFilter = proto.encodeSearchFilter(input1 as searchFilter);
      expect(searchFilter).toBe(expectResult);
    });
  });
});
