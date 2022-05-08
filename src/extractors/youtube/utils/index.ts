import UtilsBase from "../../../utils";

export { default as ytConstants } from "constants";

export default class Utils extends UtilsBase {
  /**
   * Generates the CPN, which is a random string of length 16 characters containing of only alphanumeric characters as well as the following special characters: _ -
   * @returns {string} a random CPN
   */

  static randomCPN(): string {
    return Utils.randomString(16);
  }
}
