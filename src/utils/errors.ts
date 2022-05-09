const package_json = require("~/package.json");

/**
 * Base error class. It is recommended to extend this class for custom errors.
 * @class VueTubeExtractorError
 * @extends {Error} The base error class.
 *
 * @property {string} message - Error message
 * @property {number} timestamp - The timestamp when the error occurred
 * @property {string} process - The process that created the error
 * @property {string} version - The version of the package
 * @property {string} details - The details of the error/additional information
 */
class VueTubeExtractorError extends Error {
  timestamp: number;
  process: string;
  version: string;
  details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message);
    this.timestamp = Date.now();
    this.process = process.title;
    this.version = package_json.version;
    this.details = details;
  }
}

export default { VueTubeExtractorError };
