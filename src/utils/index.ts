import UserAgent from "user-agents";

/**
 * @abstract - Main helper class, should be extended by other helpers
 * If any method is only used by a single extractor, it should be moved to that extractor's util class to prevent clutter
 */
export default abstract class UtilsBase {
  /**
   * Finds the string between two delimiters from a given string
   *
   * @param {string} base - the string to search in
   * @param {string} start - the delimiter to start searching from
   * @param {string} end - the delimiter to end searching from
   *
   * @returns {string} the string between the delimiters
   */
  static findBetween(base: string, start: string, end: string): string {
    const startIndex = base.indexOf(start);
    const endIndex = base.indexOf(end);
    if (startIndex === -1 || endIndex === -1) {
      return "";
    }
    return base.substring(startIndex + start.length, endIndex);
  }

  /**
   * Generates a random mobile UserAgent
   * @returns {UserAgent["data"]} a random mobile UserAgent
   */
  static randomMobileUserAgent(): UserAgent["data"] {
    return new UserAgent(/Android/).data;
  }

  /**
   * Generates a random string with the given length
   *
   * @param {number} length - the length of the string
   *
   * @returns {string} a random string
   */
  static randomString(length: number): string {
    return Math.random()
      .toString(36)
      .substring(2, length + 2);
  }
}
