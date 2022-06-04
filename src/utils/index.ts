import UserAgent from "user-agents";

export { default as utilityErrors } from "./errors";

/**
 * @abstract - Main helper class, should be extended by other helpers
 * If any method is only used by a single extractor, it should be moved to that extractor's util class to prevent clutter
 */
export abstract class UtilsBase {
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
