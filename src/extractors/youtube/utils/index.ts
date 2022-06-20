import { UtilsBase } from "@utils";

export { default as ytConstants } from "./constants";

export { default as YouTubeHTTPOptions } from "./youtubeHTTPOptions";

export { default as ytErrors } from "./errors";

/**
 * @class the helper class for the YouTube extractor
 *
 * @extends UtilsBase
 */
export class YtUtils extends UtilsBase {
  /**
   * Generates the CPN, which is a random string of length 16 characters containing of only alphanumeric characters as well as the following special characters: _ -
   * @returns {string} a random CPN
   */

  static randomCPN(): string {
    return super.randomString(16);
  }

  /**
   * Get string from runs array
   * @param {Array<any>} runs
   * @returns {string | void}
   */
  static getStringFromRuns(runs: Array<{ text: string }>): string {
    if (!runs) return "undefined";
    return runs.reduce((acc, cur) => {
      if (cur.hasOwnProperty("text")) {
        return acc + cur.text;
      }
      return acc;
    }, "");
  }
}
