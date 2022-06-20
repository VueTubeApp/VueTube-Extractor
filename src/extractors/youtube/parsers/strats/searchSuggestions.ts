import abstractParser from "../abstractParser";
import { searchSuggestion } from "../../types";

export default class searchSuggestions extends abstractParser {
  parse(data: [string, Array<[any]>]): searchSuggestion {
    return {
      query: data[0],
      results: data[1].map((res) => res[0]) as Array<string>,
    };
  }
}
